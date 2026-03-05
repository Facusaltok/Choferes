async function reportarSiniestro(){

const descripcion = document.getElementById("descripcion").value

const registro = localStorage.getItem("registro_jornada")

await sb
.from("registros_diarios")
.update({

hubo_siniestro:true,
descripcion_siniestro:descripcion

})
.eq("id",registro)

alert("Siniestro registrado")

}
