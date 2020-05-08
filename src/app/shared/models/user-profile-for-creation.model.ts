export interface UserProfileForCreation {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    mobileNumber?: string,
    address?: string,
    postcode?: string,
    country?: string
}