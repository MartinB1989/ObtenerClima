let d = document,
body = d.querySelector("body"),
boton = d.getElementById("boton"),
boton2 = d.getElementById("boton2"),
place = d.getElementById("place"),
template = d.querySelector(".template-card").content,
tarjetasClima = d.querySelector(".perdays").content,
divClima = d.querySelector(".tarjetas-clima"),
containerMainClima = d.querySelector(".container-card"),
fragmentUno = d.createDocumentFragment(),
fragmentDos = d.createDocumentFragment(),
auxiliar = false;

d.addEventListener("DOMContentLoaded", e => {

    d.addEventListener("submit", e =>{
        e.preventDefault()
        boton.setAttribute("disabled",false)
        boton2.removeAttribute("disabled")
        boton.style.color = "black"
        boton2.style.color = "#f0f8ff"
        auxiliar = true
        let ciudad = place.value

        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=sp&units=metric&appid=ebd9b8a6cefae88c9a049f0fe2db9836&`)
        .then(res =>res.json())
        .then(data => {
            let lat = data.coord.lat,
            lon = data.coord.lon,
            temperaturaActual= Math.round(data.main.temp),
            idIcon = data.weather[0].icon,
            pais = data.sys.country,
            linkIcon = `http://openweathermap.org/img/wn/${idIcon}@2x.png`,
            descripcion = data.weather[0].description,
            hoy = new Date()
            
            
            template.querySelector(".lugar").textContent = `${ciudad},${pais}`
            template.querySelector(".dia").textContent = `Hoy - ${hoy.toLocaleDateString()}`
            template.querySelector(".temp").textContent = `${temperaturaActual}°C`
            template.querySelector(".imagen").setAttribute("src",linkIcon)
            template.querySelector(".description").textContent = descripcion
            
            let clone = d.importNode(template, true)
            fragmentUno.appendChild(clone)
            containerMainClima.appendChild(fragmentUno)

            let array =[],
            dias = ["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];
            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=sp&exclude=hourly,minutely&appid=ebd9b8a6cefae88c9a049f0fe2db9836`)
            .then(res => res.json())
            .then(data => data.daily.forEach(element =>{
                
                array.push({
                    max:Math.round(element.temp.max),
                    min:Math.round(element.temp.min),
                    descripcion:element.weather[0].description,
                    icon:element.weather[0].icon,
                    dia:dias[hoy.getDay()+array.length]
                })

            }))
            .then(()=>array.splice(0,1))
            .then(()=>array.forEach(el =>{
                tarjetasClima.querySelector(".day").textContent = el.dia
                tarjetasClima.querySelector(".img").setAttribute("src",`http://openweathermap.org/img/wn/${el.icon}@2x.png`)
                tarjetasClima.querySelector(".max").textContent = `max: ${el.max} C°`
                tarjetasClima.querySelector(".min").textContent = `min: ${el.min} C°`
                tarjetasClima.querySelector(".desc").textContent = el.descripcion
                let clon = d.importNode(tarjetasClima,true)
                fragmentDos.appendChild(clon)
                
            })).then(()=> divClima.appendChild(fragmentDos))
           
            
            
            
        })

        .catch(err =>{
            
                let errorMessege = d.createElement("div")
                errorMessege.setAttribute("id","error")
                errorMessege.setAttribute("class","error")
                errorMessege.textContent = "La ciudad ingresada no existe o esta mal escrita. Revise el formato, tenga en cuenta que el programa es sensible a mayusculas y minusculas"
                fragmentUno.appendChild(errorMessege)
                body.appendChild(fragmentUno)
           setTimeout(()=>{
                body.removeChild(errorMessege)
                boton.removeAttribute("disabled")
                boton2.setAttribute("disabled",false)
                boton2.style.color = "black"
                boton.style.color = "#f0f8ff"
            },5000)
        })
        
        
    })

    d.addEventListener("click", e =>{
        if(e.target.matches(".boton2")){
            containerMainClima.innerHTML =""
            divClima.innerHTML = ""
            boton.removeAttribute("disabled")
            boton2.setAttribute("disabled",false)
            boton2.style.color = "black"
            boton.style.color = "#f0f8ff"
        }
    })
})