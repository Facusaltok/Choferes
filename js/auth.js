async function login(){

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const {data,error} = await sb.auth.signInWithPassword({
email,
password
})

if(error){

alert(error.message)
return

}

location.href="dashboard.html"

}
