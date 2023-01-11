import { OptionItem } from "./option-item.model";

export class ExamConfiguration {
    public ExamConfigurationID: number;
    public ExamID: number;
    public Exam: OptionItem;
    public ClassID: number;
    public Class: OptionItem;
    public SubjectID: number;
    public Subject: OptionItem;
    public TotalMark: number;
    public PassingMark: number;
}
