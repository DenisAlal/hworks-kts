import axios from "axios";
import { action, computed, makeObservable, observable } from "mobx";
import PasswordValidator from "password-validator";
import validator from "validator";
import { Meta } from "utils/Meta.ts";
import { log } from "utils/log.ts";
import { normalizeProfile, ProfileModel } from "../models";

type PrivateFields = "_meta";

class UserModalStore {
  private _meta: Meta = Meta.initial;
  authPass: string = "";
  authEmail: string = "";
  registerLogin: string = "";
  registerEmail: string = "";
  registerPass: string = "";
  registerConfirmPass: string = "";
  errorMessage: string = "";
  successMessage: string = "";
  profileData: ProfileModel | undefined;
  jwtState: string = "";
  constructor() {
    makeObservable<UserModalStore, PrivateFields>(this, {
      _meta: observable,
      authEmail: observable,
      authPass: observable,
      registerLogin: observable,
      registerEmail: observable,
      registerPass: observable,
      registerConfirmPass: observable,
      errorMessage: observable,
      successMessage: observable,
      profileData: observable,
      jwtState: observable,
      meta: computed,
      checkJWT: action,
      setDataLogin: action,
      setDataPassword: action,
      setDataLoginRegister: action,
      setDataEmail: action,
      setDataPasswordRegister: action,
      setDataConfirmPasswordRegister: action,
      login: action,
      registration: action,
      loginRequest: action,
      registrationCheckRequest: action,
      registrationRequest: action,
      clearData: action,
      getProfileData: action,
      logout: action,
    });
  }

  get meta(): Meta {
    return this._meta;
  }

  checkJWT = (): string => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      this.jwtState = jwt;
      return jwt;
    } else {
      this.jwtState = "";
    }
    return "";
  };
  setDataLogin = (value: string) => {
    this.authEmail = value;
  };
  setDataPassword = (value: string) => {
    this.authPass = value;
  };

  setDataLoginRegister = (value: string) => {
    this.registerLogin = value;
  };
  setDataEmail = (value: string) => {
    this.registerEmail = value;
  };
  setDataPasswordRegister = (value: string) => {
    this.registerPass = value;
  };
  setDataConfirmPasswordRegister = (value: string) => {
    this.registerConfirmPass = value;
  };
  login = () => {
    const schema = new PasswordValidator();
    schema.is().min(6).has().not().spaces();
    const email = this.authEmail;
    const password = this.authPass;
    this.errorMessage = "";

    if (password.length === 0) {
      this.errorMessage = "The password field cannot be empty";
    } else if (!schema.validate(password)) {
      this.errorMessage = "The password field can't be that short";
    }

    if (email.length === 0) {
      this.errorMessage = "The email field cannot be empty";
    } else {
      if (!validator.isEmail(email)) {
        this.errorMessage = "Enter valid Email!";
      }
    }

    if (this.errorMessage === "") {
      this.loginRequest();
    }
  };
  loginRequest = async () => {
    axios
      .post("https://api.escuelajs.co/api/v1/auth/login", {
        email: this.authEmail,
        password: this.authPass,
      })
      .then((response) => {
        localStorage.setItem("jwt", response.data.access_token);
        this.clearData();
        this.getProfileData();
      })
      .catch((error) => {
        log(error);
        this.errorMessage = "Login error! incorrect email or password";
      });
  };
  getProfileData = async () => {
    const token = localStorage.getItem("jwt");
    this._meta = Meta.loading;
    if (token) {
      const headers = {
        Authorization: `Bearer ${token}`,
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
  registration = () => {
    const schema = new PasswordValidator();
    schema.is().min(6).is().max(100).has().not().spaces();
    this.errorMessage = "";
    this.successMessage = "";
    if (this.registerPass.length === 0) {
      this.errorMessage = "The password field cannot be empty";
    } else if (!schema.validate(this.registerPass)) {
      this.errorMessage =
        "The password field cannot be that short, the minimum length is 6";
    }
    if (this.registerEmail.length === 0) {
      this.errorMessage = "The email field cannot be empty";
    } else {
      if (!validator.isEmail(this.registerEmail)) {
        this.errorMessage = "Enter valid Email!";
      }
    }
    if (this.registerLogin.length === 0) {
      this.errorMessage = "The login field cannot be empty";
    } else if (this.registerLogin.length <= 2) {
      this.errorMessage = "The login field cannot be less than 3 characters";
    }

    if (this.registerConfirmPass !== this.registerPass) {
      this.errorMessage = "Passwords don't match!";
    }
    if (this.errorMessage === "") {
      this.registrationRequest();
    }
  };
  registrationCheckRequest = async () => {
    axios
      .post("https://api.escuelajs.co/api/v1/users/is-available", {
        email: this.registerEmail,
      })
      .then((response) => {
        if (response.data.isAvilable) {
          this.errorMessage = "Account with this email already exists!";
        } else {
          this.registrationRequest();
        }
      })
      .catch(log);
  };

  registrationRequest = async () => {
    axios
      .post("https://api.escuelajs.co/api/v1/users/", {
        name: this.registerLogin,
        email: this.registerEmail,
        password: this.registerPass,
        avatar: "https://i.postimg.cc/T3whC3hX/Sign-in-icon.jpg",
      })
      .then((response) => {
        if (response.status === 201) {
          this.successMessage =
            "The account has been successfully created, you can log in to your account on the login tab";
          this.clearData();
        }
      })
      .catch(log);
  };

  clearData = () => {
    this.authEmail = "";
    this.authPass = "";
    this.registerPass = "";
    this.registerLogin = "";
    this.registerEmail = "";
    this.registerConfirmPass = "";
  };

  logout = () => {
    localStorage.removeItem("jwt");
    this.profileData = undefined;
  };
}

export default UserModalStore;
