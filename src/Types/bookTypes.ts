import user from "./userTypes";

export default interface book{
    _id:string,
    title:string,
    author:user,
    coverImage:string,
    genre:string,
    file:string;
}