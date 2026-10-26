// Adding dark / light Theme
const themeToggle = document.querySelector(".theme-toggle");
const body = document.querySelector("body");
const icon = themeToggle.querySelector("i");
console.log(body.classList)

themeToggle.addEventListener("click",()=>{ 
    if(body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme")
        icon.classList.replace("fa-moon","fa-sun");
         
    }else{
        icon.classList.replace("fa-sun","fa-moon");
        body.classList.add("dark-theme")
    }
});

const promptBtn = document.querySelector(".prompt-btn")
const promptInput = document.querySelector(".prompt-input")
const promptForm = document.querySelector(".prompt-form")
const modelSelect = document.querySelector("#model-select")
const countSelect = document.querySelector("#count-select")
const ratioSelect = document.querySelector("#ratio-select")
const gridGallery = document.querySelector(".gallery-grid")
const generateBtn = document.querySelector(".generate-btn")

const examplePrompts = [
  "A magic forest with glowing plants and fairy homes among giant mushrooms",
  "An old steampunk airship floating through golden clouds at sunset",
  "A future Mars colony with glass domes and gardens against red mountains",
  "A dragon sleeping on gold coins in a crystal cave",
  "An underwater kingdom with merpeople and glowing coral buildings",
  "A floating island with waterfalls pouring into clouds below",
  "A witch's cottage in fall with magic herbs in the garden",
  "A robot painting in a sunny studio with art supplies around it",
  "A magical library with floating glowing books and spiral staircases",
  "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
  "A cosmic beach with glowing sand and an aurora in the night sky",
  "A medieval marketplace with colorful tents and street performers",
  "A cyberpunk city with neon signs and flying cars at night",
  "A peaceful bamboo forest with a hidden ancient temple",
  "A giant turtle carrying a village on its back in the ocean",
];

// Calculate width / height based on chosen ratio
const getImageDimensions =  (aspectRatio,baseSize=512) =>{
    const [width,height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize/Math.sqrt(width*height);

    let calculatedWidth = Math.round(width*scaleFactor);
    let calculatedHeight = Math.round(height*scaleFactor);

    //Ensure Dimesions are Multiples of 16 (AI Model requirements)
    calculatedHeight = Math.floor(calculatedHeight/16) * 16;
    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
}
// Replace loading spinnner with the actual image
const updateImageCard = (i,result)=>{
    const imgCard = document.getElementById(`img-card-${imgIndex}`)

    if(!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML = ` <img src="${imgURL}" alt="error" class="result-img"/>
                        <div class="img-overlay">
                            <button class="img-download-btn">
                               <a href="${imgURL}" class="img-dowload-btn" download="${Date.now()}"></a>
                                <i class="fa-solid fa-download"></i>  
                            </button>
                        </div>`;
}
//send requests to Hugging face API to create images
const  generateImages = async(selectModel,imageCount,aspectRatio,promptText) => {
 const model = ""
 const {width,height} = getImageDimensions(aspectRatio)
 generateBtn.setAttribute("disabled","true");

 // create an Array of image generation promises
 const imagePromises = Array.from({length:imageCount},async(API_KEY,i)=>{
    try {
    //   const response = await fetch(MODEL_URL,{
        //   headers:{
        //     Authorization :`Bearer ${API_KEY}`,
        //     "Content-Type":"application/json",
        //     "x-use-cache":"false",
        //   },
        //   method:"POST",
        //   body:JSON.stringify(
        //     inputs:promptText,
        //     parameters:{width,height},
        //     options:{wait_for_model:true,user_cache:false}
        //   ),
    //   });
      if(!response.ok) throw new Error((await response.json)?.error);
      const result = await response.blob();
      updateImageCard(i,URL.createObjectURL(result));
 } catch(error) {
    console.log(error);
    const imgCard = document.getElementById(`img-card-${i}`);
    imgCard.classList.replace("loading","error");
    imgCard.querySelector(".status-text").textContent = "Generation failed ! check console for more details."
 }
 })
 await Promise.allSettled(imagePromises);
 generateBtn.removeAttribute("disabled","")
};

// create placeholder cards with loading spinners
const createImageCards = (selectModel,imageCount,aspectRatio,promptText)=>{
    gridGallery.innerHTML = "";
  for(let i = 0; i <imageCount ; i++)
  {
    gridGallery.innerHTML += ` <div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                        <div class="status-container">
                            <div class="spinner"></div>
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <p class="status-text">Generating...</p>
                        </div>
                     </div>`;
  }

  generateImages(selectModel,imageCount,aspectRatio,promptText);
};
// Handle form submission
const handleFormSubmit = (e) => {
    e.preventDefault();
    const selectModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value) || 1;
    const aspectRatio = ratioSelect.value || "1/1";
    const promptText = promptInput.value.trim();
    createImageCards(selectModel,imageCount,aspectRatio,promptText)
}
// fill prompt input with random example
promptBtn.addEventListener("click",()=>{
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();

});

promptForm.addEventListener("submit",handleFormSubmit);
