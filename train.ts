// ZH-TASK:

// Shunday function yozing, u berilgan array parametrni ichidagi eng katta raqamgacha tushib qolgan raqamlarni bir arrayda qaytarsin.
//MASALAN: findDisappearedNumbers([1, 3, 4, 7]) return [2, 5, 6]

function findDisappearedNumbers(arr: number[]): any {
  arr = arr.sort((a, b) => {
    return a - b;
  });
  let min: number = arr[0];
  let max: number = arr[arr.length - 1];
  let vacant: number[] = [];
  for (let i = min; i < max; i++) {
    if (!arr.includes(i)) vacant.push(i);
  }

  return vacant;
}

console.log(findDisappearedNumbers([1, 3, 5, 7]));
