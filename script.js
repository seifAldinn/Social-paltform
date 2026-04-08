// onload = () => {    ui(localStorage.getItem("token"))  }
// console.log(ui(localStorage.getItem("token")))
let currentpage = 1
let lastpage = 1
let isLoading = false

ui() //working
FitchPosts()

window.addEventListener('scroll', () => {
    // Total height of the document
    const totalHeight = document.documentElement.scrollHeight;
    // Current scroll position from top + viewport height
    const scrolledTo = window.scrollY + window.innerHeight;

    // 99.9% threshold value
    const threshold = 0.8;

    if (scrolledTo >= totalHeight * threshold && currentpage < lastpage && !isLoading) {
        console.log("Reached last 10% of the page");
        currentpage += 1
        FitchPosts(false, currentpage) // Load more posts without resetting
    }
});








// let cardFotter = document.getElementById("cardFotter")

// console.log(card)

async function FitchPosts(reset = true , page = 1) {
let container = document.getElementById("container")
if(reset) {
    container.innerHTML = ""
}

    isLoading = true
    const response = await fetch(`https://tarmeezacademy.com/api/v1/posts?limit=3&page=${page}`)
    const json = await response.json()
    isLoading = false
    lastpage = json.meta?.last_page ?? 1
    const posts = json.data
    // console.log(posts)
        for(post of posts){
            // console.log(post.tags)
            
            let content = 
            `
            <div class="card col-lg-10 col-sm-12 col-md-12 px-4 rounded-4 shadow-sm mb-3">
            <div class="card-header d-flex gap-2 align-items-center">
                <img id="profilePic" class="w-h-50 rounded-circle border border-3" src="${ post.author.profile_image}">
                <b id="userName" class="fs-5 ">
                    ${ post.author.username}
                </b>
            </div>
            <div class="card-body ">
                <div class="card-img-fluid">
                    <img id="postImg" class="w-100 rounded-4" src="${post.image}">
                </div>

                <div class="d-flex justify-content-between">
                    <h4 id="mainTxt" class="card-text "> ${post.title}</h4>
                    <span id="date" class="card-text text-muted">${post.created_at}</span>
                </div>                
                <h5 id="decTxt" class="card-text mt-3">${post.body}</h5>
            </div>
            <div class="card-footer  d-flex gap-2 align-items-center">
                <div class="fs-5 d-flex gap-1 align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                    </svg>
                    <span id="comments">
                        (${post.comments_count}) COMMENTS
                    </span>
                </div>
                <div id="postTags">
                <span class="badge rounded-pill text-bg-secondary py-2">${post.tags=null ?? "No Tags" }</span>
                    
                </div>
            </div>
            </div>
            `


            container.innerHTML += content

            let tagContainerID = `postTags-${post.id}`
            let tagContainer = document.getElementById(tagContainerID)  
            
            
        }
}




function modalHide(modelId){
    const myModalEl = document.getElementById(modelId);
    const modal = bootstrap.Modal.getInstance(myModalEl) 
    modal.hide();
}


// ------------------login------------//
let login = document.getElementById("login")
login.onclick = function loginAndRestoreToken() {

    let userNameInput = document.getElementById("userNameInput")
    let passInput = document.getElementById("passInput")

    axios.post('https://tarmeezacademy.com/api/v1/login', {
        username: userNameInput.value,
        password: passInput.value,
    })
    .then(response => {
        const token = response.data.token
        localStorage.setItem("token", token)
        localStorage.setItem("userName", JSON.stringify(response.data.user))

        appendAlert(response.data.message ?? 'Login successful!', 'success')
        modalHide("loginModal")
        ui()
        closeAlert()
    })
    .catch(error => {
        const apiMessage = error.response?.data?.message || 'Login failed. Check username/password.'
        appendAlert(apiMessage, 'danger')
    })
}

console.log(localStorage.getItem("token"))
console.log(localStorage.getItem("userName"))
// ------------------//login//------------//


// ------------------REGISTER------------//
let registerSend = document.getElementById("registerSend")
registerSend.onclick = function registerAndStoreToken() {
    let registerNameInput = document.getElementById("registerNameInput")
    let registerUserNameInput = document.getElementById("registerUserNameInput")
    let registerPassInput = document.getElementById("registerPassInput")
    let registerImageInput = document.getElementById("registerImageInput")

    let formInput = new FormData()
    formInput.append("name", registerNameInput.value)
    formInput.append("username", registerUserNameInput.value)
    formInput.append("password", registerPassInput.value)
    formInput.append("image", registerImageInput.files[0])

    headers = {
        'Content-Type': 'multipart/form-data',
    }
    

    axios.post('https://tarmeezacademy.com/api/v1/register', formInput , {
        headers: headers
    })
    .then(response => {
        const token = response.data.token
        localStorage.setItem("token", token)
        localStorage.setItem("userName", JSON.stringify(response.data.user))
        console.log(response.data)

        appendAlert(response.data.message ?? `Your account created successfully! ${registerNameInput.value}`, 'success')
        modalHide("registerModal")
        ui()
        closeAlert()
    })
    .catch(error => {
        const apiMessage = error.response?.data?.message || 'Registration failed. Please try again.'
        appendAlert(apiMessage, 'danger')
    })
    
    closeAlert()
}
// ------------------//REGISTER//------------//


// ------------------//CREATE POST//------------//
let postSend = document.getElementById("postSend")
postSend.onclick = function createPost() {

    let postTitleInput = document.getElementById("postTitleInput")
    let postBodyInput = document.getElementById("postBodyInput")
    let postImageInput = document.getElementById("postImageInput")


    let formInput = new FormData()
    formInput.append("title", postTitleInput.value)
    formInput.append("body", postBodyInput.value)
    formInput.append("image", postImageInput.files[0])

    headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
    }
    

    axios.post('https://tarmeezacademy.com/api/v1/posts', formInput , {
        headers: headers
    })
    .then(response => {
        const token = response.data.token
        console.log(response)
        closeAlert()
        appendAlert(response.data.message ?? 'post created successful!', 'success')
        modalHide("createPostModal")

        FitchPosts()
        
        
    })
    .catch(error => {
        const apiMessage = error.response?.data?.message || 'post upload failed. Check internet connection.'
        appendAlert(apiMessage, 'danger')
    })
}

// ------------------//CREATE POST//------------//


// ------------------logout------------//

let lognOutBtn = document.getElementById("lognOutBtn")
lognOutBtn.onclick = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    // confirm("Logout successful!")
    appendAlert('Log out successfuly!', 'danger')
    ui()
    closeAlert()
}
// ------------------//logout//------------//




// ---------------ui-------------------------------
function ui() {
    let token = localStorage.getItem("token")
    let registerBtn = document.getElementById("registerBtn")
    let lognOutBtn = document.getElementById("lognOutBtn")
    let profileBtn = document.getElementById("profileBtn")
    let loginBtn = document.getElementById("loginBtn")
    let createPostBtn = document.getElementById("createPostBtn")
    let navUsername = document.getElementById("nav-username")
    let navProfileImg = document.getElementById("nav-profile-img")

    let userdata = localStorage.getItem("userName")
const obj = JSON.parse(userdata);
    console.log(obj)

    
    // let jsonUserdata = JSON.parse(userdata)
// console.log(jsonUserdata)

    if(token == null){
        loginBtn.style.display = "block"
        registerBtn.style.display = "block"

        lognOutBtn.style.display = "none"
        profileBtn.style.display = "none"  
        createPostBtn.style.display = "none"  
    } else {
        loginBtn.style.display = "none"
        registerBtn.style.display = "none"

        lognOutBtn.style.display = "block"
        profileBtn.style.display = "block"
        createPostBtn.style.display = "block"

        navUsername.innerHTML = `@${obj.username}`
        navProfileImg.src = obj.profile_image

    }
}







const alert = document.getElementById('liveAlertPlaceholder')

function appendAlert  (message, type)  {

const wrapper = document.createElement('div')
wrapper.innerHTML = [
`<div class="fade show alert alert-${type} alert-dismissible" role="alert">`,
`   <div>${message}</div>`,
'   <button id="alertClose" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
'</div>'].join('')

alert.append(wrapper)
}

const alertTrigger = document.getElementById('login')
if (alertTrigger) {
    alertTrigger.addEventListener('click', () => {
        // appendAlert('Nice, you triggered this alert message!', 'success')
    })
}

function closeAlert() {
const alertClose = document.getElementById('alertClose')
    setTimeout(() => {
        alertClose.click()
    }, 3000)
}