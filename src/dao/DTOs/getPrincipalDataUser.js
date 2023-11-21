class GetPrincipalDataUserDTO {
  constructor(user) {
    this.first_name = user.first_name || '';
    this.email = user.email || '';
    this.role = user.role || 'user';
  }
}
module.exports = GetPrincipalDataUserDTO;
