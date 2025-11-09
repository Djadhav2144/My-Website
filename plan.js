function generateSchedule() {
  const scheduleDiv = document.getElementById("schedule");
  scheduleDiv.innerHTML = "";
  document.getElementById("congratsMsg").style.display = "none";
  document.getElementById("progressBar").style.width = "0%";

  const start = document.getElementById("startTime").value;
  const end = document.getElementById("endTime").value;
  const input = document.getElementById("tasks").value;
  const rawTasks = input.split(",").map(t => t.trim()).filter(t => t);

  if (!rawTasks.length) {
    alert("Please enter at least one task!");
    return;
  }

  // Smart Suggestion: Save last tasks
  localStorage.setItem("lastTasks", JSON.stringify(rawTasks));

  const importance = {
    study: 120, assignment: 90, work: 120,
    reading: 60, gym: 60, exercise: 60,
    jogging: 45, relax: 30, entertainment: 45,
    meditation: 30, others: 60
  };

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  let currentTime = new Date(); currentTime.setHours(sh, sm);
  const endTime = new Date(); endTime.setHours(eh, em);

  const schedule = [];
  let count = 0;

  while (currentTime < endTime && rawTasks.length > 0) {
    let hour = currentTime.getHours();
    if (hour >= 12 && hour < 13) {
      schedule.push({task:"🍱 Lunch", start:fmt(currentTime), end:fmt(addMin(currentTime,60))});
      currentTime = addMin(currentTime,60);
      continue;
    }
    if (hour >= 19 && hour < 20) {
      schedule.push({task:"🍽 Dinner", start:fmt(currentTime), end:fmt(addMin(currentTime,60))});
      currentTime = addMin(currentTime,60);
      continue;
    }
    const t = rawTasks.shift();
    const key = t.toLowerCase();
    const dur = importance[key] || importance["others"];
    let next = addMin(currentTime, dur);
    if (next > endTime) next = new Date(endTime);
    schedule.push({task:`🧩 ${t}`, start:fmt(currentTime), end:fmt(next)});
    currentTime = next;
    count++;
    if (count % 2 === 0 && hour !== 13 && hour !== 20 && currentTime < endTime) {
      schedule.push({task:"☕ Break", start:fmt(currentTime), end:fmt(addMin(currentTime,15))});
      currentTime = addMin(currentTime,15);
    }
  }

  displaySchedule(schedule);
}

function fmt(date){return date.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});}
function addMin(d,m){return new Date(d.getTime()+m*60000);}

function displaySchedule(list){
  const container=document.getElementById("schedule");
  const bar=document.getElementById("progressBar");
  const congrats=document.getElementById("congratsMsg");
  window.total=list.length; window.done=0;
  list.forEach(i=>{
    const div=document.createElement("div");
    div.className="task";
    div.innerHTML=`<div><strong>${i.start}-${i.end}</strong> ${i.task}</div><input type="checkbox" class="task-check">`;
    container.appendChild(div);
  });
  const boxes=container.querySelectorAll('.task-check');
  boxes.forEach(cb=>{
    cb.addEventListener('change',()=>{
      window.done=Array.from(boxes).filter(x=>x.checked).length;
      const p=(window.done/window.total)*100;
      bar.style.width=p+"%";
      if(p===100) congrats.style.display="block";
    });
  });
}

// Focus Mode
function toggleFocusMode() {
  const overlay = document.getElementById("focusOverlay");
  const music = document.getElementById("focusMusic");
  if (overlay.style.display === "flex") {
    overlay.style.display = "none";
    music.pause();
  } else {
    overlay.style.display = "flex";
    music.play();
  }
}
