async function enviarGPS(){

navigator.geolocation.getCurrentPosition(async pos=>{

const lat=pos.coords.latitude
const lng=pos.coords.longitude

const {data:user}=await sb.auth.getUser()

await sb.from("gps").insert({

user_id:user.user.id,
lat,
lng

})

})

}

setInterval(enviarGPS,30000)
