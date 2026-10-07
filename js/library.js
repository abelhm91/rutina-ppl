/* Biblioteca de ejercicios.
   p   = patrón de movimiento (hueco que ocupa en una sesión)
   g   = grupo muscular principal (para prioridades)
   eq  = dónde se puede hacer: g gimnasio completo, b gimnasio básico, h casa con mancuernas
   av  = evitar con molestias en: h hombro, c codo, m muñeca, l lumbar, r rodilla
   k   = c compuesto / i aislamiento
   t   = 's' si se mide en segundos */
const LIB = [
  // Empuje horizontal
  {id:"bp_bar",n:"Press banca con barra",p:"hpress",g:"Pecho",m:["Pecho","Tríceps","Hombro anterior"],eq:"g",av:"h",k:"c",q:"press banca barra técnica",tip:"Escápulas juntas y abajo, pies firmes. Baja controlado hasta rozar el esternón."},
  {id:"bp_db",n:"Press banca con mancuernas",p:"hpress",g:"Pecho",m:["Pecho","Tríceps"],eq:"gbh",av:"",k:"c",q:"press banca mancuernas técnica",tip:"Baja las mancuernas a los lados del pecho con los codos a unos 45° del torso."},
  {id:"bp_mach",n:"Press de pecho en máquina",p:"hpress",g:"Pecho",m:["Pecho","Tríceps"],eq:"gb",av:"",k:"c",q:"press pecho maquina técnica",tip:"Ajusta el asiento para que las asas queden a la altura del pecho medio."},
  {id:"pushup",n:"Flexiones",p:"hpress",g:"Pecho",m:["Pecho","Tríceps","Core"],eq:"gbh",av:"m",k:"c",q:"flexiones técnica correcta",tip:"Cuerpo en bloque de cabeza a talones. Si se quedan cortas, eleva los pies o añade lastre."},
  // Empuje inclinado
  {id:"ip_db",n:"Press inclinado con mancuernas",p:"ipress",g:"Pecho",m:["Pecho superior","Hombro"],eq:"gbh",av:"",k:"c",q:"press inclinado mancuernas técnica",tip:"Banco a 30°. Codos a unos 45° del torso, no abiertos en cruz."},
  {id:"ip_bar",n:"Press inclinado con barra",p:"ipress",g:"Pecho",m:["Pecho superior","Hombro","Tríceps"],eq:"g",av:"h",k:"c",q:"press inclinado barra técnica",tip:"Baja la barra a la parte alta del pecho, sin rebotar."},
  {id:"ip_mach",n:"Press inclinado en máquina",p:"ipress",g:"Pecho",m:["Pecho superior","Hombro"],eq:"gb",av:"",k:"c",q:"press inclinado maquina técnica",tip:"Pecho alto y escápulas pegadas al respaldo durante todo el recorrido."},
  // Empuje vertical
  {id:"ohp_bar",n:"Press militar de pie",p:"vpress",g:"Hombros",m:["Hombro","Tríceps","Core"],eq:"g",av:"hl",k:"c",q:"press militar de pie barra técnica",tip:"Aprieta glúteos y abdomen para no arquear la espalda. La barra sube en línea recta."},
  {id:"ohp_db",n:"Press de hombro con mancuernas sentado",p:"vpress",g:"Hombros",m:["Hombro","Tríceps"],eq:"gbh",av:"h",k:"c",q:"press hombro mancuernas sentado técnica",tip:"Respaldo casi vertical. Baja hasta que las mancuernas queden a la altura de las orejas."},
  {id:"ohp_mach",n:"Press de hombro en máquina",p:"vpress",g:"Hombros",m:["Hombro","Tríceps"],eq:"gb",av:"",k:"c",q:"press hombro maquina técnica",tip:"Espalda pegada al respaldo, sube sin bloquear los codos de golpe."},
  {id:"landmine",n:"Press landmine a una mano",p:"vpress",g:"Hombros",m:["Hombro","Pecho superior","Core"],eq:"g",av:"",k:"c",q:"landmine press técnica",tip:"Muy amable con el hombro. Empuja hacia arriba y adelante, con el abdomen firme."},
  // Elevaciones laterales
  {id:"lat_db",n:"Elevaciones laterales con mancuernas",p:"lateral",g:"Hombros",m:["Hombro lateral"],eq:"gbh",av:"",k:"i",q:"elevaciones laterales mancuernas técnica",tip:"Peso ligero, sube hasta la altura del hombro con el codo un poco flexionado. Sin balanceo."},
  {id:"lat_cable",n:"Elevaciones laterales en polea",p:"lateral",g:"Hombros",m:["Hombro lateral"],eq:"gb",av:"",k:"i",q:"elevacion lateral polea técnica",tip:"La polea mantiene tensión abajo. Sube lento y controla la bajada."},
  {id:"lat_mach",n:"Elevaciones laterales en máquina",p:"lateral",g:"Hombros",m:["Hombro lateral"],eq:"g",av:"",k:"i",q:"elevaciones laterales maquina técnica",tip:"Empuja con los codos, no con las manos. Pausa breve arriba."},
  // Aperturas
  {id:"fly_cable",n:"Cruce de poleas",p:"fly",g:"Pecho",m:["Pecho"],eq:"gb",av:"",k:"i",q:"cruce de poleas pecho técnica",tip:"Aprieta el pecho 1 segundo al juntar las manos."},
  {id:"fly_pec",n:"Contractora (pec deck)",p:"fly",g:"Pecho",m:["Pecho"],eq:"gb",av:"",k:"i",q:"pec deck contractora técnica",tip:"Codos ligeramente flexionados y fijos; el movimiento sale del hombro."},
  {id:"fly_db",n:"Aperturas con mancuernas",p:"fly",g:"Pecho",m:["Pecho"],eq:"gbh",av:"h",k:"i",q:"aperturas mancuernas técnica",tip:"Baja solo hasta notar estiramiento en el pecho, sin pasar la línea del hombro."},
  // Tríceps
  {id:"tri_push",n:"Extensión de tríceps en polea",p:"triceps",g:"Brazos",m:["Tríceps"],eq:"gb",av:"",k:"i",q:"extension triceps polea técnica",tip:"Codos pegados al cuerpo; solo se mueve el antebrazo."},
  {id:"tri_oh",n:"Extensión de tríceps sobre la cabeza en polea",p:"triceps",g:"Brazos",m:["Tríceps"],eq:"gb",av:"c",k:"i",q:"extension triceps sobre la cabeza polea técnica",tip:"Trabaja la cabeza larga del tríceps. Codos apuntando al frente."},
  {id:"tri_sk",n:"Press francés con barra Z",p:"triceps",g:"Brazos",m:["Tríceps"],eq:"g",av:"cm",k:"i",q:"press frances barra z técnica",tip:"Baja la barra hacia la frente o justo detrás, con los codos quietos."},
  {id:"tri_dip",n:"Fondos en paralelas",p:"triceps",g:"Brazos",m:["Tríceps","Pecho"],eq:"g",av:"hm",k:"i",q:"fondos en paralelas triceps técnica",tip:"Torso recto para enfocar tríceps. Baja hasta que el codo forme unos 90°."},
  {id:"tri_db",n:"Extensión de tríceps con mancuerna sobre la cabeza",p:"triceps",g:"Brazos",m:["Tríceps"],eq:"gbh",av:"c",k:"i",q:"extension triceps mancuerna sobre la cabeza técnica",tip:"Sujeta una mancuerna con las dos manos y baja detrás de la cabeza."},
  {id:"tri_kick",n:"Patada de tríceps con mancuerna",p:"triceps",g:"Brazos",m:["Tríceps"],eq:"gbh",av:"",k:"i",q:"patada de triceps mancuerna técnica",tip:"Brazo pegado al torso y paralelo al suelo; extiende el codo por completo."},
  // Tirón vertical
  {id:"pullup",n:"Dominadas",p:"vpull",g:"Espalda",m:["Dorsal","Bíceps"],eq:"g",av:"",k:"c",q:"dominadas técnica correcta",tip:"Empieza tirando con la espalda, no con los brazos. Si no llegas al rango, usa banda de asistencia."},
  {id:"lat_pd",n:"Jalón al pecho",p:"vpull",g:"Espalda",m:["Dorsal","Bíceps"],eq:"gb",av:"",k:"c",q:"jalon al pecho técnica",tip:"Saca pecho y lleva la barra a la clavícula, bajando los codos hacia los costados."},
  {id:"lat_pdn",n:"Jalón con agarre neutro",p:"vpull",g:"Espalda",m:["Dorsal","Bíceps"],eq:"gb",av:"",k:"c",q:"jalon agarre neutro técnica",tip:"Agarre con las palmas enfrentadas, más cómodo para hombros y codos."},
  {id:"db_pullover_v",n:"Pullover con mancuerna",p:"vpull",g:"Espalda",m:["Dorsal","Pecho"],eq:"h",av:"h",k:"c",q:"pullover mancuerna técnica",tip:"Brazos casi rectos; baja la mancuerna por detrás de la cabeza sintiendo el dorsal."},
  // Tirón horizontal
  {id:"row_bar",n:"Remo con barra",p:"hpull",g:"Espalda",m:["Espalda media","Dorsal","Lumbar"],eq:"g",av:"l",k:"c",q:"remo con barra técnica",tip:"Torso a unos 45°, espalda neutra. Lleva la barra al ombligo."},
  {id:"row_db",n:"Remo con mancuerna a una mano",p:"hpull",g:"Espalda",m:["Dorsal","Espalda media"],eq:"gbh",av:"",k:"c",q:"remo mancuerna una mano técnica",tip:"Apoya rodilla y mano en el banco. Lleva la mancuerna hacia la cadera."},
  {id:"row_cable",n:"Remo en polea baja",p:"hpull",g:"Espalda",m:["Espalda media","Romboides"],eq:"gb",av:"",k:"c",q:"remo polea baja técnica",tip:"Pecho alto, junta las escápulas al final y vuelve despacio."},
  {id:"row_mach",n:"Remo en máquina con apoyo en pecho",p:"hpull",g:"Espalda",m:["Espalda media","Dorsal"],eq:"gb",av:"",k:"c",q:"remo maquina apoyo pecho técnica",tip:"El apoyo descarga la zona lumbar. Tira con los codos, no con las manos."},
  {id:"row_chest",n:"Remo con mancuernas en banco inclinado",p:"hpull",g:"Espalda",m:["Espalda media","Hombro posterior"],eq:"gbh",av:"",k:"c",q:"remo mancuernas banco inclinado técnica",tip:"Túmbate boca abajo en el banco a 30–45° y rema sin despegar el pecho."},
  // Hombro posterior
  {id:"facepull",n:"Face pull",p:"reardelt",g:"Hombros",m:["Hombro posterior","Trapecio"],eq:"gb",av:"",k:"i",q:"face pull técnica",tip:"Cuerda a la altura de la cara, separa las manos al tirar. Muy bueno para la salud del hombro."},
  {id:"rev_fly",n:"Pájaros con mancuernas",p:"reardelt",g:"Hombros",m:["Hombro posterior"],eq:"gbh",av:"l",k:"i",q:"pajaros mancuernas técnica",tip:"Inclínate con la espalda recta y abre los brazos como alas, sin encoger los hombros."},
  {id:"rev_pec",n:"Contractora inversa",p:"reardelt",g:"Hombros",m:["Hombro posterior"],eq:"gb",av:"",k:"i",q:"contractora inversa técnica",tip:"Pecho pegado al respaldo, abre los brazos con los codos casi rectos."},
  // Dorsal aislado
  {id:"pullover_c",n:"Pullover en polea alta",p:"latiso",g:"Espalda",m:["Dorsal"],eq:"gb",av:"",k:"i",q:"pullover polea alta técnica",tip:"Brazos casi rectos, baja la barra hasta los muslos sintiendo el dorsal."},
  {id:"pullover_db",n:"Pullover con mancuerna",p:"latiso",g:"Espalda",m:["Dorsal","Pecho"],eq:"gbh",av:"h",k:"i",q:"pullover mancuerna técnica",tip:"Brazos casi rectos; baja la mancuerna por detrás de la cabeza sintiendo el dorsal."},
  // Bíceps
  {id:"curl_bar",n:"Curl con barra",p:"biceps",g:"Brazos",m:["Bíceps"],eq:"g",av:"m",k:"i",q:"curl con barra biceps técnica",tip:"Codos quietos a los lados, sin impulso con la espalda."},
  {id:"curl_db",n:"Curl alterno con mancuernas",p:"biceps",g:"Brazos",m:["Bíceps"],eq:"gbh",av:"",k:"i",q:"curl alterno mancuernas técnica",tip:"Gira la muñeca hacia fuera al subir y baja en 2–3 segundos."},
  {id:"curl_ham",n:"Curl martillo",p:"biceps",g:"Brazos",m:["Bíceps","Antebrazo"],eq:"gbh",av:"",k:"i",q:"curl martillo técnica",tip:"Agarre neutro (palmas mirándose). Trabaja también el agarre."},
  {id:"curl_cable",n:"Curl en polea",p:"biceps",g:"Brazos",m:["Bíceps"],eq:"gb",av:"",k:"i",q:"curl biceps polea técnica",tip:"La polea mantiene tensión en todo el recorrido. Aprieta arriba un segundo."},
  {id:"curl_pre",n:"Curl predicador en máquina",p:"biceps",g:"Brazos",m:["Bíceps"],eq:"gb",av:"c",k:"i",q:"curl predicador maquina técnica",tip:"Axilas pegadas al apoyo; no extiendas el codo de golpe abajo."},
  // Patrón rodilla
  {id:"sq_bar",n:"Sentadilla con barra",p:"squat",g:"Piernas",m:["Cuádriceps","Glúteo","Core"],eq:"g",av:"rl",k:"c",q:"sentadilla con barra técnica",tip:"Rodillas en la dirección de los pies, baja al menos hasta paralelo con la espalda neutra."},
  {id:"leg_press",n:"Prensa de piernas",p:"squat",g:"Piernas",m:["Cuádriceps","Glúteo"],eq:"gb",av:"",k:"c",q:"prensa de piernas técnica",tip:"No despegues la zona lumbar del respaldo ni bloquees las rodillas arriba."},
  {id:"sq_hack",n:"Sentadilla hack",p:"squat",g:"Piernas",m:["Cuádriceps","Glúteo"],eq:"g",av:"r",k:"c",q:"sentadilla hack maquina técnica",tip:"Pies a la anchura de hombros, baja controlado y sube empujando con todo el pie."},
  {id:"goblet",n:"Sentadilla goblet",p:"squat",g:"Piernas",m:["Cuádriceps","Glúteo","Core"],eq:"gbh",av:"",k:"c",q:"sentadilla goblet técnica",tip:"Sujeta la mancuerna pegada al pecho y baja entre las piernas con el torso erguido."},
  // Patrón cadera
  {id:"rdl_bar",n:"Peso muerto rumano con barra",p:"hinge",g:"Piernas",m:["Femoral","Glúteo","Lumbar"],eq:"g",av:"l",k:"c",q:"peso muerto rumano técnica",tip:"Cadera atrás, rodillas un poco flexionadas, barra pegada a las piernas. Para cuando notes el estiramiento."},
  {id:"hip_thrust",n:"Hip thrust",p:"hinge",g:"Glúteo",m:["Glúteo","Femoral"],eq:"gbh",av:"",k:"c",q:"hip thrust técnica",tip:"Espalda alta apoyada en el banco, barbilla al pecho y aprieta glúteo arriba 1 segundo."},
  {id:"rdl_db",n:"Peso muerto rumano con mancuernas",p:"hinge",g:"Piernas",m:["Femoral","Glúteo"],eq:"gbh",av:"l",k:"c",q:"peso muerto rumano mancuernas técnica",tip:"Mancuernas pegadas a los muslos; baja llevando la cadera hacia atrás."},
  {id:"dl",n:"Peso muerto convencional",p:"hinge",g:"Piernas",m:["Femoral","Glúteo","Espalda","Lumbar"],eq:"g",av:"l",k:"c",q:"peso muerto convencional técnica",tip:"Barra sobre el medio del pie, espalda neutra y empuja el suelo con las piernas."},
  {id:"back_ext",n:"Hiperextensiones para glúteo",p:"hinge",g:"Glúteo",m:["Glúteo","Femoral","Lumbar"],eq:"gb",av:"",k:"c",q:"hiperextensiones gluteo técnica",tip:"Redondea ligeramente la espalda alta y sube apretando glúteo, sin hiperextender."},
  // Unilateral
  {id:"bulgarian",n:"Sentadilla búlgara",p:"lunge",g:"Piernas",m:["Cuádriceps","Glúteo"],eq:"gbh",av:"r",k:"c",q:"sentadilla bulgara técnica",tip:"Pie trasero sobre el banco. Empieza con mancuernas ligeras: cuesta más de lo que parece."},
  {id:"lunge_db",n:"Zancadas con mancuernas",p:"lunge",g:"Piernas",m:["Cuádriceps","Glúteo"],eq:"gbh",av:"r",k:"c",q:"zancadas mancuernas técnica",tip:"Paso largo, baja vertical hasta que la rodilla de atrás casi toque el suelo."},
  {id:"stepup",n:"Subidas al banco (step-up)",p:"lunge",g:"Glúteo",m:["Glúteo","Cuádriceps"],eq:"gbh",av:"",k:"c",q:"step up banco técnica",tip:"Sube empujando solo con la pierna de arriba, sin impulsarte con la de abajo."},
  // Femoral
  {id:"ham_lying",n:"Curl femoral tumbado",p:"hamcurl",g:"Piernas",m:["Femoral"],eq:"gb",av:"",k:"i",q:"curl femoral tumbado técnica",tip:"Cadera pegada al banco. Baja lento, unos 3 segundos."},
  {id:"ham_seat",n:"Curl femoral sentado",p:"hamcurl",g:"Piernas",m:["Femoral"],eq:"gb",av:"",k:"i",q:"curl femoral sentado técnica",tip:"Inclina el torso un poco adelante para estirar más el femoral."},
  {id:"ham_slide",n:"Curl femoral con toalla o deslizadores",p:"hamcurl",g:"Piernas",m:["Femoral","Glúteo"],eq:"h",av:"",k:"i",q:"curl femoral con toalla suelo técnica",tip:"Tumbado boca arriba con la cadera elevada, desliza los talones hacia ti."},
  // Cuádriceps aislado
  {id:"leg_ext",n:"Extensión de cuádriceps",p:"quadext",g:"Piernas",m:["Cuádriceps"],eq:"gb",av:"r",k:"i",q:"extension de cuadriceps maquina técnica",tip:"Aguanta 1 segundo arriba con la pierna estirada."},
  // Gemelos
  {id:"calf_stand",n:"Elevación de gemelos de pie",p:"calves",g:"Piernas",m:["Gemelos"],eq:"gbh",av:"",k:"i",q:"elevacion de gemelos de pie técnica",tip:"Recorrido completo: estira abajo, pausa arriba."},
  {id:"calf_seat",n:"Elevación de gemelos sentado",p:"calves",g:"Piernas",m:["Gemelos","Sóleo"],eq:"gb",av:"",k:"i",q:"gemelos sentado maquina técnica",tip:"Trabaja el sóleo. Pausa de 1 segundo abajo para no rebotar."},
  // Glúteo aislado
  {id:"abduct",n:"Abducción de cadera en máquina",p:"glute",g:"Glúteo",m:["Glúteo medio"],eq:"gb",av:"",k:"i",q:"abduccion cadera maquina técnica",tip:"Inclina el torso un poco adelante para implicar más el glúteo."},
  {id:"kick_cable",n:"Patada de glúteo en polea",p:"glute",g:"Glúteo",m:["Glúteo"],eq:"gb",av:"",k:"i",q:"patada de gluteo polea técnica",tip:"Lleva la pierna atrás sin arquear la zona lumbar."},
  {id:"glute_bridge",n:"Puente de glúteo a una pierna",p:"glute",g:"Glúteo",m:["Glúteo","Femoral"],eq:"gbh",av:"",k:"i",q:"puente de gluteo una pierna técnica",tip:"Empuja con el talón y aprieta arriba 2 segundos."},
  // Core
  {id:"plank",n:"Plancha",p:"core",g:"Abdomen",m:["Abdomen","Core"],eq:"gbh",av:"",k:"i",t:"s",q:"plancha abdominal técnica",tip:"Glúteos y abdomen apretados, cuerpo recto. Respira sin soltar la tensión."},
  {id:"deadbug",n:"Dead bug",p:"core",g:"Abdomen",m:["Abdomen","Core"],eq:"gbh",av:"",k:"i",q:"dead bug ejercicio técnica",tip:"Zona lumbar pegada al suelo mientras extiendes brazo y pierna contrarios."},
  {id:"crunch_cable",n:"Crunch en polea",p:"core",g:"Abdomen",m:["Abdomen"],eq:"gb",av:"",k:"i",q:"crunch en polea técnica",tip:"De rodillas, enrolla la columna llevando los codos hacia los muslos."},
  {id:"pallof",n:"Pallof press",p:"core",g:"Abdomen",m:["Core","Oblicuos"],eq:"gb",av:"",k:"i",q:"pallof press técnica",tip:"Empuja la polea al frente sin dejar que el torso gire. Ideal para la zona lumbar."},
  {id:"hang_leg",n:"Elevación de piernas colgado",p:"core",g:"Abdomen",m:["Abdomen"],eq:"g",av:"l",k:"i",q:"elevacion de piernas colgado técnica",tip:"Sube las piernas sin balanceo, llevando la pelvis hacia arriba."},
  {id:"wheel",n:"Rueda abdominal",p:"core",g:"Abdomen",m:["Abdomen","Core"],eq:"gbh",av:"l",k:"i",q:"rueda abdominal técnica",tip:"Empieza de rodillas y avanza solo hasta donde puedas sin arquear la espalda."}
];

/* Plantillas de sesión: huecos en orden de importancia (se recortan por tiempo). */
const TPL = {
  push:{name:"Empuje",c:"push",focus:"Pecho · hombro · tríceps",slots:["hpress","vpress","ipress","lateral","triceps","fly","triceps","core"]},
  pull:{name:"Tirón",c:"pull",focus:"Espalda · bíceps · hombro posterior",slots:["vpull","hpull","hpull","reardelt","biceps","latiso","biceps","core"]},
  legs:{name:"Piernas",c:"legs",focus:"Cuádriceps · femoral · glúteo",slots:["squat","hinge","lunge","hamcurl","quadext","calves","glute","core"]},
  upper:{name:"Torso",c:"push",focus:"Pecho · espalda · hombro · brazos",slots:["hpress","hpull","vpress","vpull","lateral","biceps","triceps","reardelt"]},
  lower:{name:"Pierna",c:"legs",focus:"Cuádriceps · femoral · glúteo · gemelo",slots:["squat","hinge","lunge","hamcurl","quadext","calves","core","glute"]},
  fullA:{name:"Cuerpo completo A",c:"push",focus:"Sentadilla · empuje · jalón",slots:["squat","hpress","vpull","hinge","lateral","biceps","triceps","core"]},
  fullB:{name:"Cuerpo completo B",c:"pull",focus:"Cadera · remo · press hombro",slots:["hinge","hpull","ipress","lunge","vpress","reardelt","core","calves"]},
  fullC:{name:"Cuerpo completo C",c:"legs",focus:"Pierna · pecho · espalda",slots:["squat","hpress","hpull","hamcurl","lateral","triceps","biceps","core"]}
};
