import { observer, useLocalStore } from "mobx-react-lite";
import * as React from "react";
import { useCallback, useEffect } from "react";
import Button from "components/Button";
import Input from "components/Input";
import InputFile from "components/InputFile";
import Text from "components/Text";
import ProfileStore from "store/ProfileStore";
import styles from "./Profile.module.scss";

const Profile: React.FC = observer(() => {
  const store = useLocalStore(() => new ProfileStore());
  useEffect(() => {
    store.getProfileSettingsData();
  }, []);
  const handleSaveImage = useCallback(() => {
    store.uploadImage();
  }, []);
  const handleSaveData = useCallback(() => {
    store.updateNewUserData();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.infoContent}>
        <Text
          tag={"span"}
          color={"primary"}
          weight={"bold"}
          className={styles.infoContentTitle}
        >
          Profile settings
        </Text>
      </div>
      <div className={styles.userContent}>
        {store.profileData ? (
          <div>
            <div className={styles.userInfoBlock}>
              <img
                src={store.profileData.avatar}
                alt="imageAvatart"
                className={styles.image}
              />
              <div>
                <Text tag={"h1"} view={"p-20"} weight={"bold"}>
                  Name:
                  <Text tag={"span"} view={"p-20"}>
                    {" "}
                    {store.profileData.name}
                  </Text>
                </Text>
                <Text tag={"h1"} view={"p-20"} weight={"bold"}>
                  E-mail:
                  <Text tag={"span"} view={"p-20"}>
                    {" "}
                    {store.profileData.email}
                  </Text>
                </Text>
                <Text tag={"h1"} view={"p-20"} weight={"bold"}>
                  Role:
                  <Text tag={"span"} view={"p-20"}>
                    {" "}
                    {store.profileData.role}
                  </Text>
                </Text>
              </div>
            </div>
            <div>
              <Text tag={"h1"} view={"p-20"} weight={"bold"}>
                Update data:
              </Text>
              <div className={styles.inputContainer}>
                <Text tag={"h1"} view={"p-16"}>
                  Update name:
                </Text>
                <div className={styles.inputs}>
                  <Input
                    value={store.userLogin}
                    onChange={store.setUserLogin}
                    placeholder={"Enter new name"}
                  />
                </div>
              </div>
              <div className={styles.inputContainer}>
                <Text tag={"h1"} view={"p-16"}>
                  Update password:
                </Text>
                <div className={styles.inputs}>
                  <Input
                    value={store.newPassword}
                    onChange={store.setPassword}
                    placeholder={"Enter new password"}
                    type={"password"}
                  />
                </div>

                <div className={styles.inputs}>
                  <Input
                    value={store.newConfirmPassword}
                    onChange={store.setConfirmPassword}
                    placeholder={"Confirm new password"}
                    type={"password"}
                  />
                </div>
              </div>
              <div className={styles.inputContainer}>
                {store.imageLink && (
                  <img
                    src={store.imageLink}
                    alt="newImageAvatart"
                    className={styles.newImage}
                  />
                )}
                <div className={styles.inputImage}>
                  <InputFile
                    onChange={(e) =>
                      store.setImageSource(e.target.files?.[0] || null)
                    }
                    afterSlot={
                      store.imageLink === "" ? (
                        <Button onClick={handleSaveImage}>Upload</Button>
                      ) : (
                        <Button disabled>Unloaded</Button>
                      )
                    }
                  />
                  {store.imageSource ? (
                    <Text className={styles.selectedImageText} view={"p-14"}>
                      Selected image: {store.imageSource.name}
                    </Text>
                  ) : (
                    <Text className={styles.selectedImageText} view={"p-14"}>
                      To change the avatar, you need to select an image
                    </Text>
                  )}
                </div>
              </div>
              <Button onClick={handleSaveData}>Save new data</Button>
            </div>
          </div>
        ) : (
          <Text tag={"h1"} view={"p-20"}>
            {" "}
            To change user data, you need to log in (ಡ‸ಡ)
          </Text>
        )}
      </div>
    </div>
  );
});
export default Profile;
