import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import PasswordValidator from "password-validator";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProfile, ProfileModel } from "../models";

type PrivateFields = "_meta";

class ProfileStore {
  private _meta: Meta = Meta.initial;
  errorMessage: string = "";
  successMessage: string = "";
  profileData: ProfileModel | undefined;
  imageSource: File | undefined;
  imageLink: string = "";
  newPassword: string = "";
  newConfirmPassword: string = "";
  userLogin: string = "";

  constructor() {
    makeObservable<ProfileStore, PrivateFields>(this, {
      _meta: observable,
      errorMessage: observable,
      successMessage: observable,
      profileData: observable,
      imageSource: observable,
      imageLink: observable,
      newPassword: observable,
      newConfirmPassword: observable,
      userLogin: observable,
      emptyJWT: computed,
      meta: computed,
      getProfileSettingsData: action,
      setImageSource: action,
      uploadImage: action,
      setPassword: action,
      setConfirmPassword: action,
      updateNewUserData: action,
      updateDataRequest: action,
      clearAllData: action,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  get emptyJWT(): string {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      return jwt;
    } else {
      return "";
    }
  }

  getProfileSettingsData = async () => {
    const tokenProfile = localStorage.getItem("jwt");
    this._meta = Meta.loading;
    if (tokenProfile) {
      const headers = {
        Authorization: `Bearer ${tokenProfile}`,
      };
      axios
        .get("https://api.escuelajs.co/api/v1/auth/profile", { headers })
        .then((response) => {
          this.profileData = normalizeProfile(response.data);
          setTimeout(() => (this._meta = Meta.success), 500);
        })
        .catch(log);
    }
  };
  uploadImage = async () => {
    if (this.imageSource) {
      const formData = new FormData();
      formData.append("file", this.imageSource);
      await axios
        .post("https://api.escuelajs.co/api/v1/files/upload", formData)
        .then((response) => {
          this.imageLink = response.data.location;
        })
        .catch(log);
    }
  };
  updateNewUserData = () => {
    const newDataSchema = new PasswordValidator();
    newDataSchema.is().min(6).is().max(100).has().not().spaces();
    this.errorMessage = "";
    this.successMessage = "";

    if (this.userLogin.length !== 0) {
      if (this.userLogin.length <= 2) {
        this.errorMessage = "The login field cannot be less than 3 characters";
      }
    }

    if (this.newPassword.length !== 0 && this.newConfirmPassword.length !== 0) {
      if (this.newPassword.length === 0) {
        this.errorMessage = "The password field cannot be empty";
      } else if (!newDataSchema.validate(this.newPassword)) {
        this.errorMessage =
          "The password field cannot be that short, the minimum length is 6";
      }
      if (this.newConfirmPassword !== this.newConfirmPassword) {
        this.errorMessage = "Passwords don't match!";
      }
    }

    if (this.errorMessage === "") {
      this.updateDataRequest();
    }
  };
  updateDataRequest = async () => {
    const tokenProfile = localStorage.getItem("jwt");
    if (tokenProfile && this.profileData) {
      const headers = {
        Authorization: `Bearer ${tokenProfile}`,
      };
      await axios
        .put(
          `https://api.escuelajs.co/api/v1/users/${this.profileData.id}`,
          {
            name:
              this.userLogin === "" ? this.profileData.name : this.userLogin,
            avatar:
              this.imageLink === "" ? this.profileData.avatar : this.imageLink,
            password:
              this.newPassword === ""
                ? this.profileData.password
                : this.newPassword,
          },
          { headers },
        )
        .then((response) => {
          if (response.status === 200) {
            this.clearAllData();
            this.getProfileSettingsData();
          }
        })
        .catch(log);
    }
  };
  setUserLogin = (value: string) => {
    this.userLogin = value;
  };
  setPassword = (value: string) => {
    this.newPassword = value;
  };
  setConfirmPassword = (value: string) => {
    this.newConfirmPassword = value;
  };
  setImageSource = (image: File | null) => {
    if (image) {
      this.imageSource = image;
    }
  };
  clearAllData = () => {
    this.setConfirmPassword("");
    this.setPassword("");
    this.setUserLogin("");
  };
}

export default ProfileStore;
