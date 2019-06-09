/////////////////////////////////////////////////////////////
window.$ = function(f){return document.querySelector(f)}
var json = {}
let q = null
let history = []
let answered = []
let load = 0
let step = 0
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);
        json = res
        loadQuestion(res.questions)
    }
};
xmlhttp.open("GET", "src/data.json", true);
xmlhttp.send();
/////////////////////////////////////////////////////////////

function loadQuestion(data) 
{
    q = data
}

function clear()
{
    for (let index = 1; index <= 9; index++) 
    {
        $('#lId' + index).classList.remove('active-now')
    }    
}

function changeQuestion(qid) 
{        
    clear()
    if((qid+1) <= 9) {
        $('#lId' + (qid +1)).classList.add('active-now')
        if(qid >= 1)    
            $('.questions_cont.Q1>.right_arrows>span.lnr-arrow-left-circle').classList.remove('none')    
        else
            $('.questions_cont.Q1>.right_arrows>span.lnr-arrow-left-circle').classList.add('none')
        if(qid < 8)    
            $('.questions_cont.Q1>.right_arrows>span.lnr-arrow-right-circle').classList.remove('none')    
        else
            $('.questions_cont.Q1>.right_arrows>span.lnr-arrow-right-circle').classList.add('none')
        let que = q[qid]
        $('#qid').innerHTML = que.id
        $('#qidTotal').innerHTML = q.length
        $('#qcont').innerHTML = que.description
        $('#qcont').innerHTML = que.description
        $('#qa1').innerHTML = que.answers[0].content
        $('#qa2').innerHTML = que.answers[1].content
        $('#qa3').innerHTML = que.answers[2].content
        $('#qa4').innerHTML = que.answers[3].content

        $('#qa1id').setAttribute('value', que.answers[0].id)
        $('#qa2id').setAttribute('value', que.answers[1].id)
        $('#qa3id').setAttribute('value', que.answers[2].id)
        $('#qa4id').setAttribute('value', que.answers[3].id)
        let b = $('input[type=radio][name=ans]:checked')
        if(qid >= 1 && b)
            $('input[type=radio][name=ans]:checked').checked = false
        let i = (qid+1).toString()
        if(answered.includes(i))
            $('#saveAns').style.display = 'none'
        else
            $('#saveAns').style.display = 'block'
        if((qid+1) == 9) {
            $('#saveAns').innerText = 'Finalizar Test'
        }
    }
}

function backNext(direction)
{    
    let a = parseInt($('.questions_cont.Q1>.left_number>a.active-now>span').innerHTML)-1
    
    if(direction == 'B')
        changeQuestion(a-1)
    else
        changeQuestion(a+1)    
}
$('.questions_cont.Q1>.right_arrows>span.lnr-arrow-left-circle').addEventListener('click', function()
{
    backNext('B')
})
$('.questions_cont.Q1>.right_arrows>span.lnr-arrow-right-circle').addEventListener('click', function()
{
    backNext('N')
})

$('#saveAns').addEventListener('click', function() 
{
    let ind = ($('#qid').innerHTML) - 1
    let ques = q[ind]   
    let a = '' 
    let b = $('input[type=radio][name=ans]:checked')
    if(!b)
    {
        alert('Seleccione una respuesta')
    } else {
        a = b.value
        let correctAns = 0
        for (let incre = 0; incre <  ques.answers.length; incre++) {
            if(ques.answers[incre].isCorrect) {
                correctAns = ques.answers[incre].id
                break;
            }
        }
        for (let index = 0; index < ques.answers.length; index++) 
        {
            if (ques.answers[index].id == a) {
                if (ques.answers[index].isCorrect)
                {
                    $('#lId'+(ind+1)).classList.add('active-success')
                    history.push({ q: (parseInt($('#qid').innerHTML) - 1), isCorrect: true, picked: (parseInt(a)-1), correct: parseInt(correctAns)-1})
                    answered.push($('#qid').innerHTML)
                } else{                
                    $('#lId'+(ind+1)).classList.add('active-error')
                    history.push({ q: (parseInt($('#qid').innerHTML) - 1), isCorrect: false, picked: (parseInt(a)-1), correct: parseInt(correctAns)-1})
                    answered.push($('#qid').innerHTML)
                }
                break;                
            }
        }
        load+=11.11
        progress(Math.ceil(load))
        step += 1             
        changeQuestion(step)
        if(history.length == 9) 
        {            
            $('.Q2').classList.add('none')
            $('.questions_cont.Q1>.right_arrows>span.lnr-arrow-left-circle').classList.add('none')
            $('.result-cont').classList.remove('none')

            let acumulado = 0
            let html = ''
            for (let index = 0; index < history.length; index++) {
                if(history[index].isCorrect) {
                    acumulado += 11.11
                }
                html += '<tr>'
                html += '<td>'+q[history[index].q].description+'</td>'
                html += '<td>'+q[history[index].q].answers[history[index].picked].content+'</td>'
                html += '<td>'+q[history[index].q].answers[history[index].correct].content+'</td>'
                if(history[index].picked == history[index].correct)
                    html += '<td style="font-size: 12px;width:100px;">CORRECTA <span class="lnr ml-1 poppins-bold text-success lnr-checkmark-circle"></span></td>'
                else
                    html += '<td style="font-size: 12px;width:100px;">INCORRECTA <span class="lnr ml-1 poppins-bold text-error lnr-cross-circle"></span></td>'
                html += '</tr>'
            }
            $('#resTable').innerHTML = html
            if(acumulado >= 70){
                $('#result').innerHTML = 'APROVADO'
            }
            else {
                $('#result').innerHTML = 'DESAPROVADO'
            }
            $('#acumul').innerHTML = acumulado
        }        
    }        
})

progress(load)
function progress(percent)
{
    let value = percent    
    $('.loading').style.width = value + '%'
    let ss = document.createElement('div')
    ss.innerHTML = "<style>.loading:after { content: '" + value + "%' !important; }</style>"
    if(value >= 2)
    {
        ss.innerHTML = "<style>.loading:after { content: '" + value + "%' !important; right:0px; !important}</style>"
    }    
    document.getElementsByTagName("head")[0].append(ss)    
}
var sexx = function()
{
    let s = ''    
    if (this.value == 'H') {
        s = 'src/userH.png'
        $('#logImg').setAttribute('src', 'src/userH.png')
    } else {
        s = 'src/userM.png'
        $('#logImg').setAttribute('src', 'src/userM.png')
    }
    json.sex = s
}
document.querySelectorAll('input[type=radio][name=sex]')[0].addEventListener('click', sexx)
document.querySelectorAll('input[type=radio][name=sex]')[1].addEventListener('click', sexx)

$('#subName').addEventListener('click', function()
{        
    if (!$('input[name=name]').value || !$('input[type=radio][name=sex]').value)
    {
        alert('Ingresa un nombre para comenzar')
    } else {
        alert('Debes acertar más del 70% de las preguntas para poder aprobar el test')
        json.name = $('input[name=name]').value        
        $('input[name=name]').value = ''
        $('.container-log').classList.add('none')
        $('.wrapper').classList.add('none')
        $('.wrapper_question').classList.remove('none')
        $('.wrapper_question > span.name_user').innerHTML = json.name
        $('#logImgQ').setAttribute('src', json.sex)  
        changeQuestion(0)           
    }
});

// document.querySelectorAll('.questions_cont.Q1>.left_number>a')[0].addEventListener('click', function()
// {
//     let val = $(this + '>span').innerHTML
//     listClick(val-1)
// })
function listClick(val)
{    
    changeQuestion(val-1)
}