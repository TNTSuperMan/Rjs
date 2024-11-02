import index from "./components/index";
import wordcard from "./components/wordcard"
document.body.appendChild(index({da:wordcard({name:"simple",desc:"simple"})}).node)
