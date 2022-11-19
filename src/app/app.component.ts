import { Component } from '@angular/core';
import { ConfirmationService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ConfirmationService]
})
export class AppComponent {
  title = 'Customers';

  constructor(
    config: PrimeNGConfig
  ) {
    config.setTranslation({
      "dayNamesMin": [
        "Нд",
        "Пн",
        "Вт",
        "Ср",
        "Чт",
        "Пт",
        "Сб"
      ],
      "monthNames": [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень"
      ],
      "monthNamesShort": ["Січ", "Лют", "Бер", "Квіт", "Трав", "Черв", "Лип", "Серп", "Вер", "Жов", "Лис", "Груд"],
      "dateFormat": "dd.mm.yy",
      "firstDayOfWeek": 1,
      "today": "Сьогодні",
      "emptyMessage": "Нічого не знайдено"
    })
  }
}
