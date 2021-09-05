var numericTraits = [0, 0, 0, 0, 0, 0];
var equippedWearables = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function sliderCreator() {
  let sliderArray = [
    "notsure",
    "notsure2",
    "notsure3",
    "notsure4",
    "Eye Shape",
    "Eye Color",
    "notsure5",
    "Wearable",
    "Wearable",
    "Wearable",
    "Wearable",
    "Wearable",
  ];
  let sliderArrayMax = [
    "0",
    "0",
    "0",
    "0",
    "200",
    "120",
    "0",
    "160",
    "160",
    "160",
    "160",
    "160",
  ];

  let container = document.getElementById("allSliderContainer");

  for (var i = 0; i < sliderArray.length; ++i) {
    if (sliderArray[i].indexOf("notsure") > -1) {
    } else {
      let div = document.createElement("div");

      let input = document.createElement("input");
      let title = document.createElement("div");
      title.className = "selectionText";
      title.innerHTML = sliderArray[i];
      input.type = "range";
      input.min = "1";
      input.max = sliderArrayMax[i];
      input.value = sliderArrayMax[i] / 2;
      input.className = "slider";
      input.id = sliderArray[i];
      input.alt = i;

      if (i < 7) {
        input.oninput = async function () {
          updateNumericTraits(this.alt, this.value);
          await updateDisplayImage();
        };
      } else {
        input.id = sliderArray[i] + i;
        title.innerHTML = sliderArray[i];
        input.oninput = async function () {
          updateEquippedWearables(this.alt - 6, this.value);
          await updateDisplayImage();
        };
      }
      div.className = "slideContainer";

      div.appendChild(title);
      div.appendChild(input);
      container.appendChild(div);
    }
  }
}

function updateNumericTraits(loc, value) {
  numericTraits[loc] = value;
}

function updateEquippedWearables(loc, value) {
  equippedWearables[loc] = value;
}
async function updateDisplayImage() {
  const rawSVG = await Moralis.Cloud.run("getSVG", {
    numericTraits: numericTraits,
    equippedWearables: equippedWearables,
  });
  //for the use of saving it to the database
  const styledSvg = rawSVG.replace(
    "<style>",
    "<style>.gotchi-bg,.wearable-bg{display: none}"
  );

  userCreatedSVG = styledSvg;

  const svgBlob = new Blob([styledSvg], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(svgBlob);

  let svg = document.getElementById("displaySVG");
  svg.src = url;
}

sliderCreator();
updateDisplayImage(0, 0);
