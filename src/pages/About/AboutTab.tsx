import * as React from "react";
// import github from "assets/github.jpg";
import Text from "components/Text";
import styles from "./AboutTab.module.scss";
import {Link} from "react-router-dom";


const AboutTab: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContent}>
        <Text
          tag={"span"}
          color={"primary"}
          weight={"bold"}
          className={styles.infoContentTitle}
        >
          About us
        </Text>
        <Text
          view={"p-20"}
          tag={"span"}
          color={"secondary"}
          weight={"bold"}
          className={styles.infoDescription}
        >
          {" "}
          On this page you can see what a good fellow wrote this site by
          clicking on the link in GitHub located below.
        </Text>
        <a href={"https://github.com/DenisAlal"} className={styles.githubLink}>
          {/*<img src={github} alt={"github"} />*/}
        </a>
      </div>
      <Link to={"/"}></Link>
    </div>
  );
};
export default AboutTab;
