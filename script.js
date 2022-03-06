let addbtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");

let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textareaCont = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");
let lockElem = document.querySelector(".ticket-lock");
let colors = ["lightpink","lightblue" , "lightgreen" , "black" ];
let modalPriorityColor = colors[colors.length-1];

let addflag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";
let ticketsArr = []; 



for(let i = 0 ; i< toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", (e) =>{
        let currentToolBoxColors = toolBoxColors[i].classList[0];
        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColors === ticketObj.ticketColor;
        })
        //remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i = 0; i < allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }

        //display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            creatTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketId);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) =>{
         //remove previous tickets
         let allTicketsCont = document.querySelectorAll(".ticket-cont");
         for(let i = 0; i < allTicketsCont.length;i++){
             allTicketsCont[i].remove()
         }
         ticketsArr.forEach((ticketObj,idx ) => {
             creatTicket(ticketObj.ticketColor, ticketObj.ticketTask , ticketObj.ticketId)
         })
    })
}

// Listener for modal priority coloring
allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor= colorElem.classList[0];
        
    })
})

addbtn.addEventListener("click",(e) => {
    //Display Modal
    //Generate Ticket

    //Addflag, true -> Modal Display
    //Addflag false -> Modal None
    addflag = !addflag;
    if (addflag){
        modalCont.style.display ="flex";
    }else{
        modalCont.style.display ="none";
    }
})
removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    console.log(removeFlag);
})

modalCont.addEventListener("keydown",(e) => {
    let key = e.key;
    if (key == "Shift"){
        creatTicket(modalPriorityColor, textareaCont.value);
        modalCont.style.display = "none";
        addflag = false;
        setModaltoDefault();
    }
})

function creatTicket(ticketColor, ticketTask, ticketId) {
   let id = ticketId || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
</div> 
    `;
    mainCont.appendChild(ticketCont);

     // Create object of ticket and add to array
        if (!ticketId) {
            ticketsArr.push({ticketColor, ticketTask, ticketId: id});
          
    }
       
    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}
function handleRemoval(ticket, id) {
   ticket.addEventListener("click", (e) =>{
        if(!removeFlag) return;

    let idx = getTicketIdx(id);
    ticketsArr.splice(idx, 1);
    

    ticket.remove();
})
}
function handleLock(ticket ,id){
      let ticketLockElem = ticket.querySelector(".ticket-lock");
      let ticketLock = ticketLockElem.children[0];
      let ticketTaskArea = ticket.querySelector(".task-area");
      ticketLock.addEventListener("click",(e) => {
        let ticketIdx = getTicketIdx(id);
         if(ticketLock.classList.contains(lockClass)) {
            
            

             ticketLock.classList.remove(lockClass);
             ticketLock.classList.add(unlockClass);
             ticketTaskArea.setAttribute("contenteditable","true");
         } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
         }
        
      })
}

function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        //get ticketidx from tickets arr
       let ticketIdx = getTicketIdx(id);

        let currentTicketColor = ticketColor.classList[1];
        // Get ticket color idx
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        console.log(currentTicketColor, currentTicketColorIdx);
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

      
    })
    
}

function getTicketIdx(id) {
    let ticketIdx = ticketsArr.findIndex((ticketObj) => {
        return ticketObj.ticketId ===id;
    })
    return ticketIdx;
}

function setModaltoDefault() {
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElem, idx) =>{
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}