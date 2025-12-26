import{p as s}from"./pocketbase.DxbRfAQo.js";import"./pocketbase.es.B4ZgO_7c.js";const i=document.getElementById("tableBody"),l=document.getElementById("loading"),a=document.getElementById("emptyState");async function d(){l?.classList.remove("hidden"),a?.classList.add("hidden"),i&&(i.innerHTML="");try{const t=await s.collection("specializations").getFullList();if(t.length===0){a?.classList.remove("hidden");return}i&&(i.innerHTML=t.map(e=>`
                    <tr class="hover:bg-gray-50">
                        <td class="p-4 font-medium">${e.title}</td>
                        <td class="p-4 text-2xl">${e.icon}</td>
                        <td class="p-4">
                            <span class="inline-block w-4 h-4 rounded-full bg-${e.color}-500 border border-gray-200"></span>
                            <span class="ml-2 capitalize text-sm text-gray-500">${e.color}</span>
                        </td>
                        <td class="p-4 text-right space-x-2">
                            <a href="/admin/specializations/edit?id=${e.id}" class="text-blue-600 hover:underline">Düzenle</a>
                            <button 
                                data-id="${e.id}"
                                class="delete-btn text-red-600 hover:underline"
                            >
                                Sil
                            </button>
                        </td>
                    </tr>
                `).join("")),o()}catch(t){console.error("Veri yüklenemedi:",t),alert("Veriler yüklenirken bir sorun oluştu.")}finally{l?.classList.add("hidden")}}function o(){document.querySelectorAll(".delete-btn").forEach(e=>{e.addEventListener("click",async()=>{if(!confirm("Bu kaydı silmek istediğinize emin misiniz?"))return;const n=e.getAttribute("data-id");if(n)try{await s.collection("specializations").delete(n),d()}catch(r){alert("Silme işlemi başarısız!"),console.error(r)}})})}d();
