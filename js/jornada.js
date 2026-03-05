async function iniciarJornada(){

const vehiculo = document.getElementById("vehiculo").value
const km = document.getElementById("km_inicio").value
const combustible = document.getElementById("combustible_inicio").value

const user = await sb.auth.getUser()

const {error} = await sb
.from("registros_diarios")
.insert({

vehiculo_id:vehiculo,
chofer_id:user.data.user.id,

kilometros_inicio:km,
combustible_inicio:combustible

})

if(error){

alert(error.message)

}else{

alert("Jornada iniciada")

}

}
