const matrix1 = getChildrenOf(".matrix1"); 
const matrix2 = getChildrenOf(".matrix2");

const getVal = (id) => Number(getComputedStyle(cssRoot).getPropertyValue(id));
const warning = getElement("#warning");


function clear(parent)
{
    while (parent.firstChild)
    {
        parent.removeChild(parent.lastChild)
    }
}

function changeOperator(){
    let operator = "";
    const operation = getElement("#selectOption").value;
    const element = getElement("#operator");
    const description = getElement("#description");

    if (operation === "Addition")
    {
        operator = "+";
        description.innerHTML = "Rows and columns for both matrices must be the same";
    }

    if (operation === "Subtraction")
    {
        operator = "-";
        description.innerHTML = "Rows and columns for both matrices must be the same";
    }

    if (operation === "Multiplication")
    {
        operator = "*";
        description.innerHTML = "Rows of the first matrix must be the same as the column of second matrix";
    }

    element.innerHTML = operator
}

function addition()
{
    const parent = getElement("#displayAnswer");
    clear(parent);
    if (getVal("--row1") === getVal("--row2") && getVal("--col1") === getVal("--col2"))
    {
        warning.style.display = "none";
        for(let i = 0; i < getVal("--row1")*getVal("--col1"); i++)
        {
            const value = Number(matrix1[i].value) + Number(matrix2[i].value);
            createAnswerNode(value, parent,getVal("--row1"),getVal("--col2"));
        }
    }
    else
    {
        warning.innerHTML = "Rows and columns of matrices are not the same";
        warning.style.display = "block";
    }
}

function subtraction()
{
    const parent = getElement("#displayAnswer");
    clear(parent);
    if (getVal("--row1") === getVal("--row2") && getVal("--col1") === getVal("--col2"))
    {
        warning.style.display = "none";
        for(let i = 0; i < getVal("--row1") * getVal("--col1"); i++)
        {
            const value = Number(matrix1[i].value) - Number(matrix2[i].value);
            createAnswerNode(value, parent,getVal("--row1"),getVal("--col2"));
        }
    }
    else
    {
        warning.innerHTML = "Rows and columns of matrices are not the same";
        warning.style.display = "block";
    }
}


function multiplication()
{
    const parent = getElement("#displayAnswer");
    const maxColM2 = getVal("--col2");
    const maxRowM2 = getVal("--row2");

    const maxColM1 = getVal("--col1");
    const maxRowM1 = getVal("--row1");

    let matrix1CurCount = 0;
    let valueOfInput = 0;

    clear(parent);
    
    if (maxColM1 === maxRowM2)
    {
        warning.style.display = "none";

        while(matrix1CurCount < maxRowM1)
        {
            for(let col = 0; col < maxColM2; col++)
            {
                for(let r = 0; r < maxRowM2; r++)
                {
                    let M2Index = col + (r * maxColM2);
                    let matrix1Col = r + (matrix1CurCount * maxColM1);
                    valueOfInput += getChildrenOf(".matrix2")[M2Index].value * getChildrenOf(".matrix1")[matrix1Col].value;
                }
                createAnswerNode(valueOfInput, parent, maxRowM1, maxColM2);
                valueOfInput = 0;
            }
            matrix1CurCount++;
        }
    }
    else
    {
        warning.innerHTML = "Rows of matrix one and columns of matrix two are not the same";
        warning.style.display = "block";
    }
}

function createAnswerNode(value, parent, row, col)
{
    cssRoot.style.setProperty("--rowAnswer", row);
    cssRoot.style.setProperty("--colAnswer", col);

    let v = scaleIncrementVal("--rowAnswer");
    cssRoot.style.setProperty("--scaleAnswer", v);

    const div = document.createElement("div");
    const text = document.createElement("p");
    text.innerHTML = value;
    div.appendChild(text);
    parent.appendChild(div);
}

function runFunction()
{
    const operation = getElement("#selectOption").value;
    if(operation === "Addition")
    {
        addition();
    }

    if(operation === "Subtraction")
    {
        subtraction();
    }

    if(operation === "Multiplication")
    {
        multiplication();
    }
}


getElement("button").addEventListener("click",runFunction);
getElement("#selectOption").addEventListener("input", changeOperator);