import { OptionItem } from "./option-item.model";
import { EducationDetails } from "./education-details.model";
import { ExperienceDetails } from "./experience-details.model";

export class Teacher {
    public ID: number;
    public FName: string;
    public LName: string;
    public Gender: OptionItem;
    public DOB: Date;
    public KnownLanguages: OptionItem[];
    public EnglishLanguage: OptionItem[];
    public Address: string;
    public Mobile: string;
    public Email: string;
    public ImagePath: string;
    public HighestQualification: string;
    public IsExperience: string;
    public EducationDetails: EducationDetails[];
    public ExperienceDetails: ExperienceDetails[];
    // Dropdown list options
    public Genders: OptionItem[];
    public KnownLanguageOptions: OptionItem[];
    public EnglishLanguageOptions: OptionItem[];
}
