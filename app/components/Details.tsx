import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation?: string }[];
}) => {
  return (
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="bg-gray-50 w-full rounded-lg px-5 py-4 grid grid-cols-2 gap-4">
          {tips.map((tip, index) => (
              <div className="flex flex-row gap-2 items-center" key={index}>
                <img
                    src={
                      tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"
                    }
                    alt="score"
                    className="size-5"
                />
                <p className="text-xl text-gray-500 ">{tip.tip}</p>
              </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 w-full">
          {tips.map((tip, index) => (
              <div
                  key={index + tip.tip}
                  className={cn(
                      "flex flex-col gap-2 rounded-2xl p-4",
                      tip.type === "good"
                          ? "bg-green-50 border border-green-200 text-green-700"
                          : "bg-yellow-50 border border-yellow-200 text-yellow-700"
                  )}
              >
                <div className="flex flex-row gap-2 items-center">
                  <img
                      src={
                        tip.type === "good"
                            ? "/icons/check.svg"
                            : "/icons/warning.svg"
                      }
                      alt="score"
                      className="size-5"
                  />
                  <p className="text-xl font-semibold">{tip.tip}</p>
                </div>
                <p>{tip.explanation}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="medications">
            <AccordionHeader itemId="medications">
              <CategoryHeader
                  title="Medications"
                  categoryScore={feedback.medications.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="medications">
              <CategoryContent tips={feedback.medications.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="dosage">
            <AccordionHeader itemId="dosage">
              <CategoryHeader
                  title="Dosage"
                  categoryScore={feedback.dosage.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="dosage">
              <CategoryContent tips={feedback.dosage.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="instructions">
            <AccordionHeader itemId="instructions">
              <CategoryHeader
                  title="Instructions"
                  categoryScore={feedback.instructions.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="instructions">
              <CategoryContent tips={feedback.instructions.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="side-effects">
            <AccordionHeader itemId="side-effects">
              <CategoryHeader
                  title="Side Effects"
                  categoryScore={feedback.sideEffects.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="side-effects">
              <CategoryContent tips={feedback.sideEffects.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="lifestyle">
            <AccordionHeader itemId="lifestyle">
              <CategoryHeader
                  title="Lifestyle"
                  categoryScore={feedback.lifestyle.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="lifestyle">
              <CategoryContent tips={feedback.lifestyle.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;
