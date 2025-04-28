const fs=require("fs");const f="src/app/page.tsx";let c=fs.readFileSync(f,"utf8");const n=`            <div className="flex justify-center">
              <Link 
                href="/photo"
                className="px-10 py-5 bg-gray-800 text-white font-semibold text-xl rounded-full hover:bg-gray-900 transition"
              >
                Try Now
              </Link>
            </div>`;c=c.replace(/\s+<div className="flex flex-col md:flex-row gap-4 justify-center">[\s\S]*?<\/div>\s+(?=<\/div>\s+<\/section>)/,`
${n}
            `);fs.writeFileSync(f,c,"utf8");
