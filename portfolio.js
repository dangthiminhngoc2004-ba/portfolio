const answer = document.querySelector('#answer');
const gradeResult = document.querySelector('#grade-result');
document.querySelector('#grade').addEventListener('submit', (event) => {
  event.preventDefault();
  if (answer.value === '') {
    gradeResult.textContent = 'Enter a number before submitting.';
    return;
  }
  const value = answer.valueAsNumber;
  gradeResult.textContent = value >= 2.75 && value <= 3.25
    ? 'Accepted. The answer is within the allowed range.'
    : 'Outside the allowed range of 2.75–3.25.';
});
const role = document.querySelector('#role');
const seats = document.querySelector('#seats');
const inviteResult = document.querySelector('#invite-result');
function updateInvitation() {
  if (role.value === 'Member') {
    inviteResult.textContent = 'Blocked. Only owners can invite in this example.';
    return;
  }
  inviteResult.textContent = seats.value === '0'
    ? 'Blocked. There are no available seats.'
    : 'Invitation allowed.';
}
role.addEventListener('change', updateInvitation);
seats.addEventListener('change', updateInvitation);
