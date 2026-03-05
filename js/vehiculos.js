async function getVehiculos(){

const {data,error} = await sb
.from("vehiculos")
.select("*")
.eq("activo",true)

if(error){
console.log(error)
return
}

return data

}
