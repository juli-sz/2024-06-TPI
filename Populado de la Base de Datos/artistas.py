import pandas as pd
import random
from faker import Faker

# Inicializamos Faker
fake = Faker()

# Definimos los enlaces de fotos de perfil
profile_pictures_links = [
    "https://i.imgur.com/ixhb1FX.jpeg",
    "https://i.imgur.com/vzVJ3P0.jpeg",
    "https://i.imgur.com/2etpmap.jpeg",
    "https://i.imgur.com/YVpLyeT.jpeg",
    "https://i.imgur.com/5asZutc.jpeg",
    "https://i.imgur.com/MZFIpU4.jpeg",
    "https://i.imgur.com/f3iUsyh.jpeg",
    "https://i.imgur.com/4yRgWX7.jpeg",
    "https://i.imgur.com/SqReNS3.jpeg",
    "https://i.imgur.com/aJqWMNO.jpeg",
    "https://i.imgur.com/fwPK0mo.jpeg",
    "https://i.imgur.com/U5YLKP6.jpeg",
    "https://i.imgur.com/NnHFxYX.jpeg",
    "https://i.imgur.com/ydZZut5.jpeg",
    "https://i.imgur.com/deUrQFT.jpeg",
    "https://i.imgur.com/qlPPHJO.jpeg",
    "https://i.imgur.com/SYqxsif.jpeg",
    "https://i.imgur.com/gLlp8Rn.jpeg",
    "https://i.imgur.com/GJnBWI7.jpeg",
    "https://i.imgur.com/iIuxqZC.jpeg",
    "https://i.imgur.com/rtx3EUj.jpeg",
    "https://i.imgur.com/sDNZF4J.jpeg",
    "https://i.imgur.com/so7PSbS.jpeg",
    "https://i.imgur.com/TrPMUcL.jpeg",
    "https://i.imgur.com/De429IT.jpeg",
    "https://i.imgur.com/u1kseAI.jpeg",
    "https://i.imgur.com/P7Xxb9z.jpeg",
    "https://i.imgur.com/Co4AIXk.jpeg",
    "https://i.imgur.com/GfVXxZ5.jpeg",
    "https://i.imgur.com/a9iT4qE.jpeg",
    "https://i.imgur.com/4VsFxwf.jpeg",
    "https://i.imgur.com/KgHuslY.jpeg",
    "https://i.imgur.com/PApLUfV.jpeg",
    "https://i.imgur.com/i8mu2a6.jpeg",
    "https://i.imgur.com/vrO4wuJ.jpeg",
    "https://i.imgur.com/DJjqtWC.jpeg",
    "https://i.imgur.com/RF1gywO.jpeg",
    "https://i.imgur.com/BtJTpkw.jpeg",
    "https://i.imgur.com/d8jl3BO.jpeg",
    "https://i.imgur.com/QaqBtEU.jpeg",
    "https://i.imgur.com/jPyvAWi.jpeg",
    "https://i.imgur.com/WWgEqEZ.jpeg",
    "https://i.imgur.com/HeBBab6.jpeg",
    "https://i.imgur.com/tQU6jk5.jpeg",
    "https://i.imgur.com/19JKkXA.jpeg",
    "https://i.imgur.com/Z6mIZeC.jpeg",
    "https://i.imgur.com/IVDWlVy.jpeg",
    "https://i.imgur.com/hJ1lISi.jpeg",
    "https://i.imgur.com/FFY2Mju.jpeg",
    "https://i.imgur.com/5xsHPYO.jpeg",
    "https://i.imgur.com/HiiTWlx.jpeg",
    "https://i.imgur.com/KRBaBUI.jpeg",
    "https://i.imgur.com/CNtXob2.jpeg",
    "https://i.imgur.com/Pc5WxBK.jpeg",
    "https://i.imgur.com/lZp418l.jpeg",
    "https://i.imgur.com/MHwhKFm.jpeg",
    "https://i.imgur.com/VC2XmiO.jpeg",
    "https://i.imgur.com/ulQCcYj.jpeg",
    "https://i.imgur.com/i4HE7Po.jpeg",
    "https://i.imgur.com/tPWOfZR.jpeg",
    "https://i.imgur.com/q8gDS6p.jpeg",
    "https://i.imgur.com/H2JIHNQ.jpeg",
    "https://i.imgur.com/cmR9Jap.jpeg",
    "https://i.imgur.com/CqgINDd.jpeg",
    "https://i.imgur.com/Smhfgof.jpeg",
    "https://i.imgur.com/T0yyo2s.jpeg",
    "https://i.imgur.com/O2PXNlY.jpeg",
    "https://i.imgur.com/2Ae5hNF.jpeg",
    "https://i.imgur.com/cgx4RLh.jpeg",
    "https://i.imgur.com/lCQZ8IB.jpeg",
    "https://i.imgur.com/byM1dXf.jpeg",
    "https://i.imgur.com/rHrapQ1.jpeg",
    "https://i.imgur.com/WLKXtKh.jpeg",
    "https://i.imgur.com/kSpUCVZ.jpeg",
    "https://i.imgur.com/EQkWgxQ.jpeg",
    "https://i.imgur.com/d9bHS9y.jpeg",
    "https://i.imgur.com/3z6pcUw.jpeg",
    "https://i.imgur.com/N3RUWYW.jpeg",
    "https://i.imgur.com/ePts8LF.jpeg",
    "https://i.imgur.com/a0grkYn.jpeg",
    "https://i.imgur.com/S5ykmA3.jpeg",
    "https://i.imgur.com/13f97Lx.jpeg",
    "https://i.imgur.com/K2p6BMH.jpeg",
    "https://i.imgur.com/bCagdNm.jpeg",
    "https://i.imgur.com/A3etRNY.jpeg",
    "https://i.imgur.com/heYmWae.jpeg",
    "https://i.imgur.com/rElt3L3.jpeg",
    "https://i.imgur.com/KQpIccH.jpeg",
    "https://i.imgur.com/Rtnkg2S.jpeg",
    "https://i.imgur.com/RvUZ0MV.jpeg",
    "https://i.imgur.com/eDQKVEr.jpeg",
    "https://i.imgur.com/wTRR2U9.jpeg",
    "https://i.imgur.com/v4RnIkX.jpeg",
    "https://i.imgur.com/nXiagw4.jpeg",
    "https://i.imgur.com/H55gyJq.jpeg",
    "https://i.imgur.com/pV5Icrc.jpeg",
    "https://i.imgur.com/bizpnjr.jpeg",
    "https://i.imgur.com/dtbmm26.jpeg",
    "https://i.imgur.com/B17HucG.jpeg",
    "https://i.imgur.com/lG5sNej.jpeg",
    "https://i.imgur.com/eGCRMIl.jpeg",
    "https://i.imgur.com/vd0PrSY.jpeg",
    "https://i.imgur.com/QFyWX5J.jpeg",
    "https://i.imgur.com/RcPxyqt.jpeg",
    "https://i.imgur.com/8nJuUaJ.jpeg",
    "https://i.imgur.com/7DJUQic.jpeg",
    "https://i.imgur.com/Hrgn1zB.jpeg",
    "https://i.imgur.com/0MAtxpV.jpeg",
    "https://i.imgur.com/92Blv4S.jpeg",
    "https://i.imgur.com/eIWTHIY.jpeg",
    "https://i.imgur.com/gXH5zeU.jpeg",
    "https://i.imgur.com/xMYCdGj.jpeg",
    "https://i.imgur.com/UdT8SkA.jpeg",
    "https://i.imgur.com/tdPPOwp.jpeg",
    "https://i.imgur.com/YmRKMC4.jpeg",
    "https://i.imgur.com/vEvpMrx.jpeg",
    "https://i.imgur.com/ynJcMk6.jpeg",
    "https://i.imgur.com/fUQP7Ku.jpeg",
    "https://i.imgur.com/xwLgsQM.jpeg",
    "https://i.imgur.com/8XkPqSf.jpeg",
    "https://i.imgur.com/ZknABW8.jpeg",
    "https://i.imgur.com/12qnhDB.jpeg",
    "https://i.imgur.com/N8ToBwK.jpeg",
    "https://i.imgur.com/Y5w7GaI.jpeg",
    "https://i.imgur.com/lcHQNUG.jpeg",
    "https://i.imgur.com/dbR7sBh.jpeg",
    "https://i.imgur.com/k3t1hOh.jpeg",
    "https://i.imgur.com/PJfzARn.jpeg",
    "https://i.imgur.com/axVRZBM.jpeg",
    "https://i.imgur.com/TAXXoIp.jpeg",
    "https://i.imgur.com/7eYh3Fk.jpeg",
    "https://i.imgur.com/1yX0rCQ.jpeg",
    "https://i.imgur.com/KLLW1V6.jpeg",
    "https://i.imgur.com/3dzNFib.jpeg",
    "https://i.imgur.com/TFtHggQ.jpeg",
    "https://i.imgur.com/1anHvCW.jpeg",
    "https://i.imgur.com/fw07jfP.jpeg",
    "https://i.imgur.com/UEfZZZm.jpeg",
    "https://i.imgur.com/Yk1aGBX.jpeg",
    "https://i.imgur.com/JWHjSqG.jpeg",
    "https://i.imgur.com/4iyX3eg.jpeg",
    "https://i.imgur.com/FLtVuCV.jpeg",
    "https://i.imgur.com/QyhifEd.jpeg",
    "https://i.imgur.com/IZ0C9Gi.jpeg",
    "https://i.imgur.com/vDyYtsF.jpeg",
    "https://i.imgur.com/YGArBIT.jpeg",
    "https://i.imgur.com/FLBrnu5.jpeg",
    "https://i.imgur.com/Ppxq2PU.jpeg",
    "https://i.imgur.com/53vM7Ez.jpeg",
    "https://i.imgur.com/63JsMZk.jpeg",
    "https://i.imgur.com/cHcenbF.jpeg",
    "https://i.imgur.com/5JacaxU.jpeg",
    "https://i.imgur.com/FcoM1L4.jpeg",
    "https://i.imgur.com/LG37o51.jpeg",
    "https://i.imgur.com/D1vVJyc.jpeg",
    "https://i.imgur.com/bPrvUOL.jpeg",
    "https://i.imgur.com/zzq6G25.jpeg",
    "https://i.imgur.com/8MrnCC3.jpeg",
    "https://i.imgur.com/Lb38mI3.jpeg",
    "https://i.imgur.com/zS7sVjc.jpeg",
    "https://i.imgur.com/9u81zv0.jpeg",
    "https://i.imgur.com/cQILWBX.jpeg",
    "https://i.imgur.com/2kgX4yJ.jpeg",
    "https://i.imgur.com/Hq62DHR.jpeg",
    "https://i.imgur.com/yhL0Et6.jpeg",
    "https://i.imgur.com/RD1B6A8.jpeg",
    "https://i.imgur.com/ul7IUc8.jpeg",
    "https://i.imgur.com/JoauE8l.jpeg",
    "https://i.imgur.com/OwOoHAz.jpeg",
    "https://i.imgur.com/I17lRUd.jpeg",
    "https://i.imgur.com/GP6TfYT.jpeg",
    "https://i.imgur.com/RSBlDXM.jpeg",
    "https://i.imgur.com/YhuIUOC.jpeg",
    "https://i.imgur.com/a0Fhwwx.jpeg",
    "https://i.imgur.com/9NzabY2.jpeg",
    "https://i.imgur.com/ItbwGxe.jpeg",
    "https://i.imgur.com/Cc7Xeul.jpeg",
    "https://i.imgur.com/2HO23Xj.jpeg",
    "https://i.imgur.com/kZM8fy1.jpeg",
    "https://i.imgur.com/F9hZgfr.jpeg",
    "https://i.imgur.com/2mOd5SU.jpeg",
    "https://i.imgur.com/ku7QmaX.jpeg",
    "https://i.imgur.com/ptviPTa.jpeg",
    "https://i.imgur.com/f39q8iY.jpeg",
    "https://i.imgur.com/wme2iGz.jpeg",
    "https://i.imgur.com/0VnDDM3.jpeg",
    "https://i.imgur.com/UN1LYRv.jpeg",
    "https://i.imgur.com/BKWZSf5.jpeg",
    "https://i.imgur.com/PTxDpwN.jpeg",
    "https://i.imgur.com/xiCNCBU.jpeg",
    "https://i.imgur.com/lXysH4X.jpeg",
    "https://i.imgur.com/7WczCyg.jpeg",
    "https://i.imgur.com/Ms3FW3N.jpeg",
    "https://i.imgur.com/2oo0FLG.jpeg",
    "https://i.imgur.com/pIuS2qL.jpeg",
    "https://i.imgur.com/wfNUfPs.jpeg",
    "https://i.imgur.com/tnT62U2.jpeg",
    "https://i.imgur.com/zhu1zz1.jpeg",
    "https://i.imgur.com/qrE2QgI.jpeg"
]

# Verificamos que haya suficientes enlaces para el número de artistas que queremos crear
num_artistas = len(profile_pictures_links)
if num_artistas == 0:
    raise ValueError("No hay enlaces de fotos de perfil disponibles.")

# Generar DNIs únicos
dni_list = random.sample(range(10000000, 50000000), num_artistas)

# Listas para almacenar los datos generados
dni = []
nombres = []
biografias = []
contactos = []
url_foto = []

# Llenamos los datos para cada artista usando Faker
for i in range(num_artistas):
    dni.append(dni_list[i])
    nombres.append(fake.name())  # Nombre realista usando Faker
    biografia = fake.text(max_nb_chars=150)  # Generar una biografía aleatoria
    biografias.append(biografia[:100])  # Asegurarse de que tenga como máximo 100 caracteres
    contactos.append(fake.email())  # Correo electrónico realista
    url_foto.append(profile_pictures_links[i])  # Asignar un enlace único

# Crear un DataFrame con los datos de la tabla Artistas
df_artistas = pd.DataFrame({
    'DNI': dni,
    'NyA': nombres,
    'res_biografia': biografias,
    'contacto': contactos,
    'URL_foto': url_foto
})

# Guardamos el DataFrame en un archivo CSV
df_artistas.to_csv('artistas.csv', index=False)

print("Archivo artistas.csv creado exitosamente uwu")
