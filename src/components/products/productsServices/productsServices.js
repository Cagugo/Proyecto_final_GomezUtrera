const { User } = require('../../../models/users');
const MailManager = require('../../../utils/mailManager/mailManager');
const path = require('path');
const { Product } = require('../../../models/products');
const { productsServices, usersServices } = require('../../../repositories/index');
const CustomError = require('../../../utils/errors/services/customError');
const EErrors = require('../../../utils/errors/services/enums');
const { generateProductErrorInfo } = require('../../../utils/errors/services/info');

class ProductsServices {
  getProducts = async (limit, page, sort, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : 'asc',
      };
      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};
      const result = await productsServices.paginate(filter, options);
      if (page && !/^\d+$/.test(page)) {
        return res.sendUserError('The page must be a valid number');
      } else if (page && (parseInt(page) < 1 || parseInt(page) > result.totalPages)) {
        return res.sendUserError('The page number does not exist');
      } else {
        const data = {
          status: 'success',
          payload: result.docs,
          totalPages: result.totalPages,
          prevPage: result.prevPage || null,
          nextPage: result.nextPage || null,
          page: result.page,
          hasPrevPage: result.hasPrevPage,
          hasNextPage: result.hasNextPage,
          prevLink: result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
          nextLink: result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        };
        return res.sendSuccess({ message: 'All Products', payload: data });
      }
    } catch (error) {
      return res.sendServerError('Error getting products');
    }
  };
  getProductsViews = async (limit, page, query, res) => {
    try {
      const options = {
        limit: limit ? parseInt(limit) : 10,
        page: page ? parseInt(page) : 1,
      };
      const filter = query
        ? query === '0'
          ? {
              $or: [{ category: query }, { stock: 0 }],
            }
          : { category: query }
        : {};
      const result = await productsServices.paginate(filter, options);
      const formattedProducts = result.docs.map((product) => {
        const imgThumbnail = product.thumbnails.length > 0 ? product.thumbnails[0] : '';
        return {
          _id: product._id,
          title: product.title,
          description: product.description,
          code: product.code,
          price: product.price,
          stock: product.stock,
          category: product.category,
          thumbnails: imgThumbnail,
          owner: product.owner,
        };
      });
      const totalPages = result.totalPages;
      const currentPage = result.page;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevPage = result.hasPrevPage ? result.prevPage : null;
      const nextPage = result.hasNextPage ? result.nextPage : null;
      const prevLink = result.hasPrevPage ? `/products?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLink = result.hasNextPage ? `/products?limit=${options.limit}&page=${result.nextPage}` : null;
      const prevLinkAdmin = result.hasPrevPage ? `/admin/dashboard/products?limit=${options.limit}&page=${result.prevPage}` : null;
      const nextLinkAdmin = result.hasNextPage ? `/admin/dashboard/products?limit=${options.limit}&page=${result.nextPage}` : null;
      return {
        products: formattedProducts,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        currentPage,
        prevLink,
        nextLink,
        prevLinkAdmin,
        nextLinkAdmin,
      };
    } catch (error) {
      return res.sendServerError('Error handlebars');
    }
  };
  getProductById = async (pid, res) => {
    try {
      const product = await productsServices.findById(pid);
      if (!product) {
        return res.sendNotFound('Product not found');
      } else {
        const data = product;
        return res.sendSuccess(data);
      }
    } catch (error) {
      return res.sendServerError('Error getting product');
    }
  };
  addProduct = async (payload, images, res, req) => {
    try {
      const { title, description, code, price, stock, category } = payload;
      const userData = req.session.user || req.user;
      if (!title || !description || !code || !price || !stock || !category) {
        try {
          CustomError.createError({
            name: 'Product creation error',
            cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
            message: 'Error Trying to create Product',
            code: EErrors.INVALID_TYPES_ERROR,
          });
        } catch (error) {
          console.error('An error occurred in CustomError:', error);
        }
        return res.sendServerError('Required fields are missing from the Product');
      } else {
        const existingProduct = await productsServices.findOne({ code: code });
        if (existingProduct) {
          return res.sendUserError('A product with the same code already exists');
        } else {
          const owner = {
            id: userData._id,
            role: userData.role,
          };
          const newProduct = new Product({
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: images && images.length > 0 ? images.map((image) => image.filename) : [],
            owner: owner,
          });
          const savedProduct = await productsServices.save(newProduct);
          const user = await User.findById(userData._id);
          user.products.push(savedProduct);
          await user.save();
          await productsServices.populateOwner(newProduct);
          const totalProducts = await productsServices.countDocuments({});
          const data = newProduct;

          req.app.io.emit('newProduct', newProduct);
          req.app.io.emit('totalProductsUpdate', totalProducts);

          return res.sendCreated({ message: 'Product added successfully', payload: data });
        }
      }
    } catch (error) {
      return res.sendServerError('Error adding product');
    }
  };
  updateProduct = async (pid, updateFields, images, res, req) => {
    try {
      const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));
      if (invalidFields.length > 0) {
        return res.sendUserError(`The following fields cannot be modified: ${invalidFields.join(', ')}`);
      } else {
        const product = await productsServices.findById(pid);
        if (!product) {
          return res.sendNotFound('Product not found');
        }
        const userData = req.session.user || req.user;
        if (userData.role === 'premium' && product.owner !== userData._id) {
          return res.sendUserError('This product was not created by you as a Premium user. You do not have permissions to update this product');
        }
        if (images && images.length > 0) {
          updateFields.thumbnails = images.map((image) => image.filename);
        }
        const updatedProduct = await productsServices.findByIdAndUpdate(pid, updateFields, { new: true });
        const data = updatedProduct;

        req.app.io.emit('updateProduct', updatedProduct);

        return res.sendSuccess({ message: 'Successfully updated product', payload: data });
      }
    } catch (error) {
      return res.sendServerError('Error updating product');
    }
  };
  deleteProduct = async (pid, res, req) => {
    try {
      const product = await productsServices.findById(pid);
      if (!product) {
        return res.sendNotFound('Product not found');
      }
      const userData = req.session.user || req.user;
      const productOwnerIdString = product.owner.id.toString();
      if (userData.role === 'premium' && productOwnerIdString !== userData._id) {
        return res.sendUserError('This product was not created by you as a Premium user. You do not have permissions to remove this product');
      }
      const deletedProduct = await productsServices.findByIdAndDelete(pid);
      if (!deletedProduct) {
        return res.sendNotFound('Product not found');
      }
      const user = await User.findById(product.owner.id);
      const productIndex = user.products.indexOf(pid);
      if (productIndex !== -1) {
        user.products.splice(productIndex, 1);
      }
      await user.save();
      const data = deletedProduct;
      const totalProducts = await productsServices.countDocuments({});
      if (product.owner.role === 'premium') {
        let ownerUser;
        ownerUser = await User.findById(product.owner.id);
        const userEmail = ownerUser.email;
        const loginLink = `http://localhost:8080/`;
        const emailContent = `
          <h1>Your product has been removed</h1>
          <p>Hola ${ownerUser.first_name},</p>
          <p>Your product ID <strong>${pid}</strong> created as User <strong>${ownerUser.role.toUpperCase()}</strong> has been deleted.</p>
          <p>If you have any questions or need help, you can ask in the chat in your user profile when you log in again <a href="${loginLink}">here</a>.</p>
        `;
        const attachments = [
          {
            filename: 'vf.png',
            path: path.join(__dirname, '../../../uploads/mail/vf.png'),
          },
        ];
        const emailPayload = {
          from: 'carlosgomez@gmail.com',
          to: userEmail,
          subject: 'Villa Frida - Product Disposal',
          html: emailContent,
          attachments,
        };
        try {
          await MailManager.sendEmail(emailPayload);
          req.logger.info(`Mail sent to Premium user ${ownerUser.email} informing the removal of your product`);
        } catch (error) {
          console.error('Failed to send email:', error);
        }
      }
      req.app.io.emit('deleteProduct', pid);
      req.app.io.emit('totalProductsUpdate', totalProducts);

      return res.sendSuccess({ message: 'Product disposed correctly', payload: data });
    } catch (error) {
      return res.sendServerError('Error deleting product');
    }
  };
}
module.exports = new ProductsServices();
