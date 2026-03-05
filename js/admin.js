async function estadisticas(){

const {data:vehiculos} = await sb
.from("vehiculos")
.select("*")

const {data:choferes} = await sb
.from("users")
.select("*")

const {data:jornadas} = await sb
.from("registros_diarios")
.select("*")

return {

vehiculos:vehiculos.length,
choferes:choferes.length,
jornadas:jornadas.length

}

}
