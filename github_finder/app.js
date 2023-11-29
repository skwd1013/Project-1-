
class UI {
  constructor() {
    this.profile = document.getElementById("profile");
  }

  showProfile(user) {
    this.profile.innerHTML = `<div class="card card-body mb-3">
        <div class="row">
            <div class="col-md-3"> 
                <img class="img-fluid mb-2" src="${user.avatar_url}" >
                <a href="${user.html_url}" target="_blank" class="btn 
                btn-primary btn-block mb-4">View Profile</a>
            </div>
            <div class="col-md-9">
              <span class="badge badge-primary">
              Public Repos: ${user.public_repos}
              </span>
              <span class="badge badge-secondary">
              Public Gists: ${user.public_gists}
              </span>
              <span class="badge badge-success">
              Public Repos: ${user.followers}
              </span>
              <span class="badge badge-info">
              Public Repos: ${user.following}
              </span>
            <br><br>
            <ul class="list-group">
                <li class="list-group-item">Company: ${user.company}</li>
                <li class="list-group-item">Website/Blog: ${user.blog}</li>
                <li class="list-group-item">Location: ${user.location}</li>
                <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
            </div>
        </div>
      </div>
    <h3 class="page-heading mb-3">Latest Repos</h3>
    <div id="repos"></div>
    <div id="grass"></div>
    

`;
  }
  
  showGrass(grass){
    this.grass= document.getElementById("grass");
    this.grass.innerHTML=`<img src="https://ghchart.rshah.org/${grass}"> `
  }

  showRepos(repos) {
    let output = "";

    repos.forEach(function(repo) {
      output += `
      <div class="card card-body mb-2">
        <div class="row">
          <div class="col-md-6">
           <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
          <div class="col-md-6">
          <span class="badge badge-primary">
          Stars: ${repo.stargazers_count}
          </span>
          <span class="badge badge-secondary">
          Watchers: ${repo.watchers_count}
          </span>
          <span class="badge badge-success">
          Forks: ${repo.forms_count}
          </span>
          </div>
        </div>
      </div>
      `;
    });
    document.getElementById('repos').innerHTML = output;
  }

  

  showAlert(message, className) {
    this.clearAlert();
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".search_container");
    const search = document.querySelector(".search");
    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }

  clearProfile() {
    this.profile.innerHTML = "";
  }
}

class Github {
  constructor() {
 
    this.repos_count = "5";
    this.repos_sort = "created:asc";
  }

  async getUser(user) {

    const profileResponse = await fetch(
      `https://api.github.com/users/${user}`
    )

    const repoResponse = await fetch(
      `https://api.github.com/users/${user}
      /repos?per_page=${this.repos_count}&sort=${this.repos_sort}`
    )

 

    const profile = await profileResponse.json();
    const repos = await repoResponse.json();
    
    
    return {
      profile,
      repos,
     
    }
  }
}


//init Github
const github = new Github();
const ui = new UI();

const searchUser = document.getElementById("searchUser");

searchUser.addEventListener("keyup", (e) => {
  const userText = e.target.value;

  if (userText !== "") {
    //Make http call
    github.getUser(userText).then((data) => {
      if (data.profile.message === "Not Found") {
        //show alert
        ui.showAlert("User Not Found", "alert alert-danger");
      } else {
        //show profile
        ui.showProfile(data.profile);
        ui.showRepos(data.repos);
        ui.showGrass(userText);
      }
    });
  } else {
    //clear profile
    ui.clearProfile();
  }
});
