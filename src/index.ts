import chalk from "chalk";
import { catchError, filter, from, interval, switchMap, tap } from "rxjs";
import { sentTelegramAlert } from "./alert";
import { checkAvailability } from "./availability-check";

interval(5000)
  .pipe(
    switchMap(() => {
      return from(checkAvailability());
    }),
    tap((models) => {
      console.info(
        models.length === 0
          ? chalk.red(
              `No models available at ${new Date().toLocaleString("en-US", {
                timeZone: "Asia/Dubai",
              })}`
            )
          : chalk.green(`Models Available --> ${models.join(", ")}`)
      );
    }),
    filter((items) => items.length > 0),
    switchMap((itemsAvailable) => {
      return from(sentTelegramAlert(itemsAvailable.join(", ")));
    }),
    catchError((err) => {
      console.error(err);
      return from(sentTelegramAlert(err.message));
    })
  )
  .subscribe(() => {
    console.log("Checked");
  });
