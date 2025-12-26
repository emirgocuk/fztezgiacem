import{p as o}from"./pocketbase.DxbRfAQo.js";import"./pocketbase.es.B4ZgO_7c.js";const n=document.getElementById("desktopPostsList"),i=document.getElementById("mobilePostsList");async function l(){try{console.log("Fetching posts...");const e=await o.collection("posts").getFullList();if(e.sort((t,r)=>new Date(r.created).getTime()-new Date(t.created).getTime()),e.length===0){const t='<div class="p-8 text-center text-gray-400 text-sm">Henüz yazı bulunmamaktadır.</div>';n&&(n.innerHTML='<tr><td colspan="4" class="px-6 py-8 text-center text-gray-400 text-sm">Henüz yazı bulunmamaktadır.</td></tr>'),i&&(i.innerHTML=t);return}n&&(n.innerHTML=e.map(t=>`
                <tr class="hover:bg-green-50/50 transition-colors group">
                    <td class="px-6 py-4">
                        <div class="font-semibold text-gray-900 line-clamp-1 group-hover:text-[#1E3A1A] transition-colors">${t.title}</div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-[#1E3A1A]">
                            ${t.category||"Genel"}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${(()=>{try{const r=t.published_date||t.created;return new Date(r).toLocaleDateString("tr-TR",{day:"numeric",month:"short",year:"numeric"})}catch{return"-"}})()}
                    </td>
                    <td class="px-6 py-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-3 text-sm">
                             <a href="/admin/posts/edit?id=${t.id}" class="text-gray-500 hover:text-[#1E3A1A] font-medium transition-colors">Düzenle</a>
                             <button class="text-gray-400 hover:text-red-600 transition-colors delete-btn" data-id="${t.id}" title="Sil">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                             </button>
                        </div>
                    </td>
                </tr>
            `).join("")),i&&(i.innerHTML=e.map(t=>`
            <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                <div class="flex justify-between items-start gap-4">
                    <h3 class="font-bold text-gray-900 line-clamp-2 leading-snug">${t.title}</h3>
                    <span class="shrink-0 px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-[#1E3A1A]">
                        ${t.category||"Genel"}
                    </span>
                </div>
                
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    ${(()=>{try{const r=t.published_date||t.created;return new Date(r).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}catch{return"-"}})()}
                </div>

                <div class="flex gap-3 pt-2 border-t border-gray-50 mt-1">
                    <a href="/admin/posts/edit?id=${t.id}" class="flex-1 bg-gray-50 text-gray-700 hover:bg-gray-100 text-center py-2.5 rounded-xl text-sm font-bold transition-colors">
                        Düzenle
                    </a>
                    <button class="w-12 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors delete-btn" data-id="${t.id}" title="Sil">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
            `).join("")),document.querySelectorAll(".delete-btn").forEach(t=>{t.addEventListener("click",async r=>{const s=r.target.closest(".delete-btn");if(!s||!confirm("Bu yazıyı silmek istediğinize emin misiniz?"))return;const a=s.dataset.id;if(a)try{await o.collection("posts").delete(a),l()}catch(d){alert("Silme işlemi başarısız: "+d.message)}})})}catch(e){console.error("Dashboard Fetch Error Detailed:",e),e.data&&console.error("Validation Data:",e.data),n&&(n.innerHTML=`<tr><td colspan="4" class="px-6 py-8 text-center text-red-500">
            Veriler yüklenirken hata oluştu.<br/>
            <span class="text-xs text-gray-400">${e.message}</span>
        </td></tr>`)}}l();
