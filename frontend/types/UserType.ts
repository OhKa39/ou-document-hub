type UserType = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: Date;
  createdAt: Date;
  roles: string[];
  provider: string;
  avatarLink: string;
  sellerInformationDTO?: SellerInformationType;
} | null;

export default UserType;
