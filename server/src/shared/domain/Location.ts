export enum Campus {
  BOLOGNA = "Bologna",
  CESENA = "Cesena",
  FORLI = "Forlì",
  RAVENNA = "Ravenna",
  RIMINI = "Rimini",
}

export class Site {
  constructor(
    public city: string,
    public address: string,
  ) {}
}
