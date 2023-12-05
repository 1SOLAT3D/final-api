const OpenApiSnippet = require('openapi-snippet');

fetch('http://localhost:8080/api-docs-json')
    .then(respuesta => respuesta.json() )
            .then(desc => {
                const openApi = desc
                const targets = ['javascript_xhr','go_native']

                try{
                    const results = OpenApiSnippet.getSnippets(openApi, targets)
                    console.log('^^^^^^^^^^^^') 
                    console.log(results)
                    console.log('----------')
                    const results2 = OpenApiSnippet.getEndpointSnippets(openApi,'/lec2023', 'put', targets)
                    console.log('^^^^^^^^^^^^') 
                    console.log(results2)
                    console.log('----------')
                }catch(err){
                    console.log("Ocurrio un error: " + err);
                }
            });