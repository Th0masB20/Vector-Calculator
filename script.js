const getElement = (id) => document.querySelector(id);
const getChildrenOf = (id) => document.querySelector(id).children;
const matrixIndex = (id) => id.charAt(id.length - 1);
const cssRoot = document.querySelector(":root");

let scaleIncrementVal = (id) => {
    let matrixId = Number(matrixIndex(id));

    if (!isNaN(matrixId) && getVal('--col' + matrixId) === 0)
    {
        return 1;
    }
    else if ((Number(getVal(id)) - 2) > 0)
    {
        return 1 + (Number(getVal(id)) - 2) * 0.5;
    } 
    return 1;
}

//gets value of input boxes and adjusts grid based on that
function changeRow(id)
{   
    //getComputedStyle(root).getPropertyValue to get the value
    clear(getElement("#displayAnswer"));
    let value = Number(getChildrenOf(id)[0].value);

    if(value > 6)
    {
        warning.innerHTML = `Enter a number between 1 and 6`;
        warning.style.display = "block";
        value = 6;
        getChildrenOf(id)[0].value = value;
    }
    else if(isNaN(value)) 
    {
        warning.innerHTML = `Enter a number between 1 and 6`;
        warning.style.display = "block";
        value = 0;
        getChildrenOf(id)[0].value = value;
    }
    else{
        warning.style.display = "none";
    }

    const rowId = "--row" + matrixIndex(id);
    cssRoot.style.setProperty(rowId, value);

    cssRoot.style.setProperty("--scale" + matrixIndex(id), scaleIncrementVal(rowId));

    row1 = getVal('--row1');
    row2 = getVal('--row2');
}


function changeColumn(id)
{
    clear(getElement("#displayAnswer"));
    let value = Number(getChildrenOf(id)[1].value);

    if(value > 6)
    {
        warning.innerHTML = `Enter a number between 1 and 6`;
        warning.style.display = "block";
        value = 6;
        getChildrenOf(id)[1].value = value;
    }
    else if(isNaN(value)) 
    {
        warning.innerHTML = `Enter a number between 1 and 6`;
        warning.style.display = "block";
        value = 0;
        getChildrenOf(id)[1].value = value;
    }
    else
    {
        warning.style.display = "none";
    }

    const colId = "--col" + matrixIndex(id);
    cssRoot.style.setProperty(colId, value);

    //sets right size of brakets
    if(isNaN(value) || value === 0)
    {
        cssRoot.style.setProperty("--scale" + matrixIndex(id), 1);
    }
    else {
        changeRow(id); // set the scale of the brackets
    }

    col1 = getVal('--col1');
    col2 = getVal('--col2');
}

function createMatrixEntry(id)
{
    const parent = getElement(id);
    const row = getComputedStyle(cssRoot).getPropertyValue("--row" + matrixIndex(id));
    const column = getComputedStyle(cssRoot).getPropertyValue("--col" + matrixIndex(id));

    while(parent.lastChild)
    {
        parent.removeChild(parent.firstChild);
    }

    for(let r = 0; r < row; r++)
    {
        for(let c = 0; c < column; c++)
        {
            let element = document.createElement("input");
            element.setAttribute("type", "text");
            element.setAttribute("autocomplete", "off");
            element.placeholder = 0;
            parent.appendChild(element);
        }
    }
}

createMatrixEntry(".matrix1");
createMatrixEntry(".matrix2");



//when changing value of row and col input
getChildrenOf("#rowColInput1")[1].addEventListener("input", () => {
    changeColumn("#rowColInput1");
    createMatrixEntry(".matrix1");
});
getChildrenOf("#rowColInput1")[0].addEventListener("input", function () {
    changeRow("#rowColInput1");
    createMatrixEntry(".matrix1")
});

//second imput changes
getChildrenOf("#rowColInput2")[1].addEventListener("input", function () {
    changeColumn("#rowColInput2");
    createMatrixEntry(".matrix2");
});
getChildrenOf("#rowColInput2")[0].addEventListener("input", function () {
    changeRow("#rowColInput2");
    createMatrixEntry(".matrix2");
});



