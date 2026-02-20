import styles from "./Home.module.css";
import Button from "../../components/Button/Button";

export default function AdminHome() {
  const mainApp = document.getElementById("main-app");
  mainApp!.innerHTML = `
    <div class="${styles["home-container"]}">
      <div class="${styles["admin-header"]}">
        <h2>Admin Dashboard</h2>
        <p>Consistency is more important than perfection.
        </p>
        <!-- <p>It’s a slow process, but quitting won’t speed it up.</p> -->
      </div>
      <div class="${styles["admin-links"]}">
        <article class="${styles["summary-card"]} ${styles["user-card"]}">
          <h3>Manage Users</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: 12<p>
            <p>Inactive: 5<p> 
            <p>Total: 17</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["admin-card"]}">
          <h3>Admins</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: 12<p>
            <p>Inactive: 5<p> 
            <p>Total: 17</p>         
          </div>
        </article>
        <article class="${styles["summary-card"]} ${styles["exercise-card"]}">
          <h3>Exercises</h3>
          <div class="${styles["summary-status"]}">
            <p>Active: 12<p>
            <p>Inactive: 5<p> 
            <p>Total: 17</p>         
          </div>
          
        </article>
        <article class="${styles["summary-card"]} ${styles["plan-card"]}">
          <h3>Quick Plans</h3>          
          <div class="${styles["summary-status"]}">
            <p>Active: 12<p>
            <p>Inactive: 5<p> 
            <p>Total: 17</p>         
          </div>
          
        </article>
      </div>
      ${Button({
        label: `<p> + </p><p> Add Exercise </p>`,
      })}
      
    </div>
  `;
}
