// onload = () => {    ui(localStorage.getItem("token"))  }
// console.log(ui(localStorage.getItem("token")))
ui() //working










let container = document.getElementById("container")
// let cardFotter = document.getElementById("cardFotter")
container.innerHTML = ""
FitchPosts()

// console.log(card)

async function FitchPosts() {
    const response = await fetch('https://tarmeezacademy.com/api/v1/posts?limit=30')
    const json = await response.json()
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
                    <h4 id="mainTxt" class="card-text "> ${post.body}</h4>
                    <span id="date" class="card-text text-muted">${post.created_at}</span>
                </div>                
                <h5 id="decTxt" class="card-text mt-3">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos distinctio consequuntur voluptatum, quaerat impedit doloremque praesentium modi cumque iure recusandae? Laudantium adipisci deserunt tempore eligendi at, cupiditate et qui natus.</h5>
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


// let userNameInput = document.getElementById("userNameInput")
// let passInput = document.getElementById("passInput")
let login = document.getElementById("login")





// login.addEventListener("click", loginAndRestoreToken())

// ------------------login------------//
function modalHide(){
    const myModalEl = document.getElementById('loginModal');
    const modal = bootstrap.Modal.getInstance(myModalEl) 
    modal.hide();
}


login.onclick = async function loginAndRestoreToken() {

    let userNameInput = document.getElementById("userNameInput")
    let passInput = document.getElementById("passInput")

    let response = await axios.post('https://tarmeezacademy.com/api/v1/login', {
        "username": userNameInput.value,
        "password": passInput.value,
    })
    console.log(response.data.token)
    let token = await response.data.token
    localStorage.setItem("token", token)
    localStorage.setItem("userName", response.data.user.username)   


    if (localStorage.getItem("token") === token) {
        console.log("success token")
        appendAlert('Login successful!', 'success')
    }else{
        console.log("error token")
        appendAlert('Login failed. Check username/password.', 'danger')
    
    }
    // hide-modal-when-logging-in---//
    modalHide()
    // hide-modal-when-logging-in---//
    //--------- update btns--------//
    ui() 
    //-----// update btns//--------//
    //closeAlert after 2s after login//
    closeAlert()
    //closeAlert after 2s after login//

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

    axios.post('https://tarmeezacademy.com/api/v1/register', {
        username: registerUserNameInput.value,
        password: registerPassInput.value,
        name: registerNameInput.value,
    })
    .then(response => {
        const token = response.data.token
        localStorage.setItem("token", token)
        localStorage.setItem("userName", response.data.user.username)

        appendAlert(response.data.message ?? `Your account created successfully! ${registerNameInput.value}`, 'success')
        modalHide()
        ui()
        closeAlert()
    })
    .catch(error => {
        const apiMessage = error.response?.data?.message || 'Registration failed. Please try again.'
        appendAlert(apiMessage, 'danger')
    })
}
// ------------------//REGISTER//------------//


// ------------------logou------------//

let lognOutBtn = document.getElementById("lognOutBtn")
lognOutBtn.onclick = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userName")
    // confirm("Logout successful!")
    appendAlert('Login out successfuly!', 'danger')
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
    if(token == null){
        loginBtn.style.display = "block"
        registerBtn.style.display = "block"

        lognOutBtn.style.display = "none"
        profileBtn.style.display = "none"  
    } else {
        loginBtn.style.display = "none"
        registerBtn.style.display = "none"

        lognOutBtn.style.display = "block"
        profileBtn.style.display = "block"
    }
}


// console.log(localStorage.getItem("token") === null)








const alert = document.getElementById('liveAlertPlaceholder')

function appendAlert  (message, type)  {

const wrapper = document.createElement('div')
wrapper.innerHTML = [
`<div class="alert alert-${type} alert-dismissible" role="alert">`,
`   <div>${message}</div>`,
'   <button id="alertClose" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
'</div>'].join('')

alert.append(wrapper)
}

const alertTrigger = document.getElementById('login')
tru = true
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