(this["webpackJsonprepul.ink"]=this["webpackJsonprepul.ink"]||[]).push([[0],{120:function(e,t,a){"use strict";a.r(t);var c=a(1),n=a.n(c),s=a(65),i=a.n(s),r=(a(71),a(8)),o=a(6),l=a(4),j=a(31),d=a(12),u=a.n(d),b=a(5),h=a.n(b);function O(e,t){var a=h.a.random.getBytesSync(8),c=h.a.pbe.opensslDeriveBytes(e,a,32),n=h.a.util.createBuffer(c),s=n.getBytes(24),i=n.getBytes(8),r=h.a.cipher.createCipher("3DES-CBC",s);r.start({iv:i}),r.update(h.a.util.createBuffer(t)),r.finish();var o=h.a.util.createBuffer();return null!==a&&(o.putBytes("Salted__"),o.putBytes(a)),o.putBuffer(r.output),o.getBytes()}function f(e,t){var a=h.a.util.createBuffer(t);a.getBytes("Salted__".length);var c=a.getBytes(8),n=h.a.pbe.opensslDeriveBytes(e,c,32),s=h.a.util.createBuffer(n),i=s.getBytes(24),r=s.getBytes(8),o=h.a.cipher.createDecipher("3DES-CBC",i);return o.start({iv:r}),o.update(a),o.finish(),o.output.toString()}var p=a(0);var x=function(e){var t=e.text,a=e.color,c=e.type;return Object(p.jsx)("a",{href:"/",children:Object(p.jsxs)("div",{className:"social",style:{backgroundColor:a},children:[Object(p.jsx)("span",{children:t}),Object(p.jsx)("i",{className:"fab fa-".concat(c)})]})})};var g=function(e){var t=e.user,a="me"==Object(o.f)().username,n=Object(o.f)().username;t&&(n=t);var s=Object(c.useState)(n),i=Object(l.a)(s,2),d=i[0],b=i[1],O=Object(c.useState)(),g=Object(l.a)(O,2),y=g[0],v=g[1],m=Object(c.useState)(),w=Object(l.a)(m,2),k=w[0],S=w[1],C=Object(c.useState)(),B=Object(l.a)(C,2),N=(B[0],B[1]),P=Object(c.useState)(),_=Object(l.a)(P,2),A=_[0],D=_[1],U=Object(c.useState)(),E=Object(l.a)(U,2),F=E[0],K=E[1],M=Object(c.useState)(),T=Object(l.a)(M,2),z=T[0],I=T[1],J=Object(c.useState)(!1),R=Object(l.a)(J,2),W=R[0],q=R[1];return Object(c.useEffect)((function(){fetch("/api/id/".concat(d)).then((function(e){return e.json()})).then((function(e){e.code&&(window.location.href="/"),b(e.username),v(e.name),S(e.blurb),N(e.key_decrypt)}),(function(e){window.location.href="/"}))}),[]),Object(p.jsxs)(p.Fragment,{children:[Object(p.jsxs)("div",{style:{opacity:y?1:0},className:"box",children:[Object(p.jsx)("div",{className:"qr",children:Object(p.jsx)(j.QRCode,{size:225,value:"".concat(window.location.origin,"/id/").concat(d),qrStyle:"dots",bgColor:"#1c1f28",fgColor:"#f8faf9",logoImage:"/logo.png",logoWidth:"75",logoOpacity:"0.8"})}),Object(p.jsxs)("div",{children:[Object(p.jsx)("h1",{children:y}),Object(p.jsx)("p",{children:k}),Object(p.jsx)("div",{children:Object(p.jsxs)("div",{style:{display:"inline-block"},children:[Object(p.jsx)(x,{text:"Jihoon Yang (@lanpai)",color:"#1DA1F2",type:"twitter"}),Object(p.jsx)(x,{text:"Jihoon Yang (@lanpai)",color:"#0366d6",type:"github"}),Object(p.jsx)(x,{text:"Jihoon Yang",color:"#4267B2",type:"facebook"})]})}),a&&Object(p.jsx)(r.b,{to:"/edit",children:Object(p.jsx)("small",{className:"soft",children:"Edit your profile"})})]})]}),Object(p.jsx)("div",{style:{display:a?"flex":"none",opacity:y?1:0,backgroundColor:"transparent"},className:"box",children:Object(p.jsxs)("div",{children:[Object(p.jsx)(r.b,{onClick:function(){q(!W)},children:Object(p.jsx)("small",{className:"soft",children:W?"Want to sign text?":"Want to sign a file?"})}),W?Object(p.jsxs)("div",{style:{marginTop:5},children:[Object(p.jsx)("label",{style:{marginRight:4},for:"file",children:"Browse"}),Object(p.jsx)("small",{style:{color:"var(--midground)"},children:(null===z||void 0===z?void 0:z.name)||"No file selected"}),Object(p.jsx)("input",{id:"file",style:{display:"none"},type:"file",onChange:function(e){I(e.target.files[0])}})]}):Object(p.jsx)("input",{style:{marginTop:5},type:"text",placeholder:"Message",value:A,onChange:function(e){D(e.target.value)}}),Object(p.jsx)("input",{type:"password",placeholder:"Password",value:F,onChange:function(e){K(e.target.value)}}),Object(p.jsxs)("button",{onClick:function(){return W||A?W&&!z?alert("File is missing!"):F?void u.a.post("/api/prepareSign").then((function(e){switch(e.data.code){case 0:try{var t,a=h.a.pki.privateKeyFromPem(f(F,e.data.key_encryption)),c=h.a.md.sha1.create();if(W){var n=new FileReader;n.onloadend=function(e){var s=n.result;c.update(s,"binary"),t=c.digest().toHex();var i=a.sign(c);u.a.post("/api/sign",{hash:t,signature:i}).then((function(e){if(e.data.code)return alert("Unknown error");var t=e.data.uuid;window.location.href="".concat(window.location.origin,"/sig/").concat(t)})).catch((function(e){alert("Unknown error!")}))},n.readAsBinaryString(z)}else{t=A,c.update(A,"utf8");var s=a.sign(c);u.a.post("/api/sign",{payload:t,signature:s}).then((function(e){if(e.data.code)return alert("Unknown error");var t=e.data.uuid;window.location.href="".concat(window.location.origin,"/sig/").concat(t)})).catch((function(e){alert("Unknown error!")}))}}catch(i){alert("Invalid password!")}break;default:alert(e.data.message)}})):alert("Password is missing!"):alert("Payload is missing!")},children:["Sign ",Object(p.jsx)("i",{className:"fas fa-pen-alt"})]})]})})]})};var y=function(){console.log(Object(o.f)());var e=Object(c.useState)(Object(o.f)().uuid),t=Object(l.a)(e,2),a=t[0],n=(t[1],Object(c.useState)()),s=Object(l.a)(n,2),i=s[0],d=s[1],u=Object(c.useState)(),b=Object(l.a)(u,2),O=b[0],f=b[1],x=Object(c.useState)(),g=Object(l.a)(x,2),y=g[0],v=g[1],m=Object(c.useState)(),w=Object(l.a)(m,2),k=w[0],S=w[1],C=Object(c.useState)(),B=Object(l.a)(C,2),N=B[0],P=B[1],_=Object(c.useState)(),A=Object(l.a)(_,2),D=A[0],U=A[1],E=Object(c.useState)(),F=Object(l.a)(E,2),K=F[0],M=F[1],T=Object(c.useState)(!1),z=Object(l.a)(T,2),I=z[0],J=z[1];return Object(c.useEffect)((function(){fetch("/api/sig/".concat(a)).then((function(e){return e.json()})).then((function(e){e.code&&(window.location.href="/"),d(e.username),f(e.signature),v(e.hash),S(e.text)}),(function(e){window.location.href="/"}))}),[]),Object(c.useEffect)((function(){i&&fetch("/api/id/".concat(i)).then((function(e){return e.json()})).then((function(e){e.code&&(window.location.href="/"),U(e.name),M(e.blurb),P(e.key_decrypt)}),(function(e){window.location.href="/"}))}),[i]),Object(c.useEffect)((function(){if(N){var e=h.a.pki.publicKeyFromPem(N);console.log(O),J(e.verify(h.a.util.hexToBytes(y),O))}}),[N]),Object(p.jsxs)("div",{style:{opacity:N?1:0,display:"flex",flexDirection:"column"},className:"box",children:[Object(p.jsx)(j.QRCode,{size:225,value:"".concat(window.location.origin,"/sig/").concat(a),qrStyle:"dots",bgColor:"#1c1f28",fgColor:"#f8faf9",logoImage:"/logo.png",logoWidth:"75",logoOpacity:"0.8"}),Object(p.jsx)("br",{}),Object(p.jsx)("p",{children:k}),Object(p.jsx)("small",{className:"soft",children:y}),I?Object(p.jsxs)("h2",{style:{color:"deepskyblue"},children:["Verified ",Object(p.jsx)("i",{className:"fas fa-check-circle"})]}):Object(p.jsx)("h2",{style:{color:"var(--foreground)"},children:"Verifying..."}),Object(p.jsx)("div",{style:{width:"100%"},children:Object(p.jsx)("hr",{})}),Object(p.jsx)(r.b,{to:"/id/".concat(i),children:Object(p.jsx)("h1",{children:D})}),Object(p.jsx)("p",{children:K})]})};function v(){return Object(p.jsx)("i",{style:{textAlign:"center",width:16},className:"fas fa-check"})}function m(){return Object(p.jsx)("i",{style:{textAlign:"center",width:16},className:"fas fa-times"})}var w=function(){var e=Object(c.useState)(""),t=Object(l.a)(e,2),a=t[0],n=t[1],s=Object(c.useState)(""),i=Object(l.a)(s,2),o=i[0],j=i[1],d=o.length>=14,b=/(?=.*[a-z])(?=.*[A-Z])/.test(o),f=/(?=.*[-+_!@#$%^&*., ?])/.test(o);return Object(p.jsx)("div",{className:"box",children:Object(p.jsxs)("div",{children:[Object(p.jsx)("h2",{children:"Create your repul.ink account"}),Object(p.jsxs)("div",{style:{padding:5},children:[Object(p.jsxs)("p",{children:[d?Object(p.jsx)(v,{}):Object(p.jsx)(m,{})," Must contain at least 14 characters"]}),Object(p.jsxs)("p",{children:[b?Object(p.jsx)(v,{}):Object(p.jsx)(m,{})," Must have both capital and lowercase letters"]}),Object(p.jsxs)("p",{children:[f?Object(p.jsx)(v,{}):Object(p.jsx)(m,{})," Must contain at least 1 symbol"]}),Object(p.jsx)("input",{type:"text",placeholder:"Username",value:a,onChange:function(e){n(e.target.value)}}),Object(p.jsx)("input",{type:"password",placeholder:"Password",value:o,onChange:function(e){j(e.target.value)}}),Object(p.jsx)("button",{onClick:function(e){return a?d?b?f?void h.a.pki.rsa.generateKeyPair({bits:2048,workers:2},(function(e,t){e&&console.error(e);var c=h.a.pki.publicKeyToPem(t.publicKey),n=h.a.pki.privateKeyToPem(t.privateKey);console.log(c),console.log(n),u.a.post("/api/register",{username:a,key_decrypt:c,key_encrypt:O(o,n)}).then((function(e){switch(e.data.code){case 0:window.location.href="/login";break;default:alert(e.data.message)}}))})):alert("Must contain at least 1 symbol"):alert("Must have both capital and lowercase letters"):alert("Must contain at least 14 characters!"):alert("Username is required!")},children:"Register"}),Object(p.jsx)(r.b,{to:"/login",children:Object(p.jsx)("small",{className:"soft",children:"Already have an account?"})})]})]})})};function k(){return Object(p.jsx)("i",{style:{textAlign:"center",width:16},className:"fas fa-check"})}function S(){return Object(p.jsx)("i",{style:{textAlign:"center",width:16},className:"fas fa-times"})}var C=function(){var e=Object(c.useState)(""),t=Object(l.a)(e,2),a=t[0],n=t[1],s=Object(c.useState)(""),i=Object(l.a)(s,2),o=i[0],j=i[1],d=o.length>=14,b=/(?=.*[a-z])(?=.*[A-Z])/.test(o),O=/(?=.*[-+_!@#$%^&*., ?])/.test(o);return Object(p.jsx)("div",{className:"box",children:Object(p.jsxs)("div",{children:[Object(p.jsx)("h2",{children:"Login to your repul.ink account"}),Object(p.jsxs)("div",{style:{padding:5},children:[Object(p.jsxs)("p",{children:[d?Object(p.jsx)(k,{}):Object(p.jsx)(S,{})," Password contains at least 14 characters"]}),Object(p.jsxs)("p",{children:[b?Object(p.jsx)(k,{}):Object(p.jsx)(S,{})," Password contains both capital and lowercase letters"]}),Object(p.jsxs)("p",{children:[O?Object(p.jsx)(k,{}):Object(p.jsx)(S,{})," Password contains at least 1 symbol"]}),Object(p.jsx)("input",{type:"text",placeholder:"Username",value:a,onChange:function(e){n(e.target.value)}}),Object(p.jsx)("input",{type:"password",placeholder:"Password",value:o,onChange:function(e){j(e.target.value)}}),Object(p.jsx)("button",{onClick:function(e){return a?d?b?O?void u.a.post("/api/prepareLogin",{username:a}).then((function(e){switch(e.data.code){case 0:try{var t=h.a.pki.privateKeyFromPem(f(o,e.data.key_encryption)),c=h.a.md.sha1.create();c.update(a,"utf8");var n=t.sign(c);u.a.post("/api/login",{username:a,signature:n}).then((function(e){window.location.href="/id/me"})).catch((function(e){alert("Unknown error!")}))}catch(s){alert("Invalid password!")}break;default:alert(e.data.message)}})):alert("Password contains at least 1 symbol"):alert("Password contains both capital and lowercase letters"):alert("Password contains at least 14 characters!"):alert("Username is missing!")},children:"Login"}),Object(p.jsx)(r.b,{to:"/register",children:Object(p.jsx)("small",{className:"soft",children:"Don't have an account?"})})]})]})})};var B=function(){var e=Object(c.useState)(!1),t=Object(l.a)(e,2),a=t[0],n=t[1],s=Object(c.useState)(),i=Object(l.a)(s,2),o=(i[0],i[1]),j=Object(c.useState)(),d=Object(l.a)(j,2),b=d[0],h=d[1],O=Object(c.useState)(),f=Object(l.a)(O,2),g=f[0],y=f[1],v=Object(c.useState)(),m=Object(l.a)(v,2),w=(m[0],m[1]);return Object(c.useEffect)((function(){fetch("/api/id/me").then((function(e){return e.json()})).then((function(e){e.code&&(window.location.href="/"),n(!0),o(e.username),h(e.name),y(e.blurb),w(e.key_decrypt)}),(function(e){window.location.href="/"}))}),[]),Object(p.jsx)("div",{style:{opacity:a?1:0},className:"box",children:Object(p.jsxs)("div",{children:[Object(p.jsx)("input",{style:{color:"var(--highlight)",fontWeight:700,fontSize:32,marginTop:0},type:"text",placeholder:"Display Name",value:b,onChange:function(e){h(e.target.value)}}),Object(p.jsx)("input",{style:{color:"var(--foreground)",fontSize:16,marginTop:0},type:"text",placeholder:"Blurb",value:g,onChange:function(e){y(e.target.value)}}),Object(p.jsx)("div",{children:Object(p.jsxs)("div",{style:{display:"inline-block"},children:[Object(p.jsx)(x,{text:"Connect Twitter",color:"#1DA1F2",type:"twitter"}),Object(p.jsx)(x,{text:"Connect GitHub",color:"#0366d6",type:"github"}),Object(p.jsx)(x,{text:"Connect Facebook",color:"#4267B2",type:"facebook"})]})}),Object(p.jsx)("button",{onClick:function(){u.a.post("/api/edit",{name:b,blurb:g}).then((function(e){switch(e.data.code){case 0:alert("Successfully updated profile.");break;default:alert(e.data.message)}}))},children:"Apply"}),Object(p.jsx)(r.b,{to:"/id/me",children:Object(p.jsx)("small",{className:"soft",children:"View your profile"})})]})})};var N=function(){return Object(p.jsxs)(r.a,{children:[Object(p.jsx)("div",{className:"header",children:Object(p.jsx)(r.b,{to:"/",children:Object(p.jsxs)("h1",{children:[Object(p.jsx)("img",{src:"/logo192.png"}),"repul.ink"]})})}),Object(p.jsx)("div",{className:"center",children:Object(p.jsxs)(o.c,{children:[Object(p.jsx)(o.a,{path:"/register",children:Object(p.jsx)(w,{})}),Object(p.jsx)(o.a,{path:"/login",children:Object(p.jsx)(C,{})}),Object(p.jsx)(o.a,{path:"/id/:username",children:Object(p.jsx)(g,{})}),Object(p.jsx)(o.a,{path:"/sig/:uuid",children:Object(p.jsx)(y,{})}),Object(p.jsx)(o.a,{path:"/edit",children:Object(p.jsx)(B,{})}),Object(p.jsx)(o.a,{path:"/",exact:!0,children:Object(p.jsx)("h1",{children:"Under Construction"})}),Object(p.jsx)(o.a,{children:Object(p.jsxs)("div",{children:[Object(p.jsx)("h1",{children:"Page not found"}),Object(p.jsx)("p",{children:"Seems you've taken a wrong turn!"})]})})]})})]})};i.a.render(Object(p.jsx)(n.a.StrictMode,{children:Object(p.jsx)(N,{})}),document.getElementById("root"))},36:function(e,t){},71:function(e,t,a){}},[[120,1,2]]]);
//# sourceMappingURL=main.55d779b1.chunk.js.map