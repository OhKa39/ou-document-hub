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
  isVerified?: boolean;
  isSeller?: boolean;
} | null;

export default UserType;
