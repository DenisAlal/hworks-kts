import * as React from "react"
import HomePage from "./pages";
import styles from "./App.module.scss"
const App: React.FC = () =>  {
    return (
        <div className={styles.app}>
            <HomePage/>
        </div>
    )
}

export default App
