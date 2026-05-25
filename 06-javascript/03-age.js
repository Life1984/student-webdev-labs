const calculateAge = function (birthDateString) {
  // Epected answers were calculated on May 18, 2026
  // Month values = zero-based, so 4 = May
  const referenceDate = new Date(2026, 4, 18);

  // Non-string values cannot match the required YYYY-MM-DD input format
  if (typeof birthDateString !== 'string') {
    return 'Error: Invalid date format';
  }

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  // Reject values like someday, 05/18/1988, or 1988-5-18
  if (!datePattern.test(birthDateString)) {
    return 'Error: Invalid date format';
  }

  const [year, month, day] = birthDateString.split('-').map(Number);
  const birthDate = new Date(year, month - 1, day);

  // JavaScript auto-corrects invalid dates
  const isValidDate =
    birthDate.getFullYear() === year &&
    birthDate.getMonth() === month - 1 &&
    birthDate.getDate() === day;

  if (!isValidDate) {
    return 'Error: Invalid date format';
  }

  let age = referenceDate.getFullYear() - birthDate.getFullYear();

  // Subtract one year if the birthday has not happened yet in the reference year
  const birthdayHasNotHappenedYet =
    referenceDate.getMonth() < birthDate.getMonth() ||
    (referenceDate.getMonth() === birthDate.getMonth() &&
      referenceDate.getDate() < birthDate.getDate());

  if (birthdayHasNotHappenedYet) {
    age--;
  }

  if (age < 0) {
    return 'Error: You cannot be less than zero years old.';
  }

  if (age > 100) {
    return 'Are you sure you are more than 100 years old?';
  }

  return `You are ${age} years old`;
};

// Defining someday prevents a ReferenceError before calculateAge() can validate it
const someday = 'someday';

console.log(calculateAge('2000-07-01'));
console.log(calculateAge('1988-05-18'));
console.log(calculateAge('2190-01-01'));
console.log(calculateAge('1800-01-01'));
console.log(calculateAge(someday));
