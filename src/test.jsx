import { jwtDecode, InvalidTokenError } from "jwt-decode";

// Пример JWT токена для декодирования (замените его на ваш реальный токен)
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOiI2NWU4NGQ5MzEyMzZjMTU3MTAxYjJhMzkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJVc2VyIiwiZXhwIjoxNzEwNzMzNTA1LCJpc3MiOiJNeUF1dGhTZXJ2ZXIiLCJhdWQiOiJNeUF1dGhDbGllbnQifQ.mbtjpF193VyR1hAp-xfGh9IQh-olS--NO2YdTx8F9Fs";

try {
  // Декодируем JWT токен
  const decodedToken = jwtDecode(jwtToken);

  // Выводим содержимое декодированного токена в консоль
  console.log("Decoded JWT Token:", decodedToken);
} catch (error) {
  // Обрабатываем возможные ошибки
  if (error instanceof InvalidTokenError) {
    console.error("Invalid token:", error.message);
  } else {
    console.error("An unexpected error occurred:", error);
  }
}
