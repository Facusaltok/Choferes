async function cargarCombustible(){

const litros = document.getElementById("litros").value
const monto = document.getElementById("monto").value
const tipo = document.getElementById("tipo").value

const file = document.getElementById("ticket").files[0]

const filename = Date.now()+"_"+file.name

await sb.storage
.from("tickets-combustible")
.upload(filename,file)

const url = sb.storage
.from("tickets-combustible")
.getPublicUrl(filename).data.publicUrl

await sb.from("combustible_cargas")
.insert({

litros:litros,
monto:monto,
tipo_combustible:tipo,
url_ticket:url

})

alert("Carga registrada")

}
