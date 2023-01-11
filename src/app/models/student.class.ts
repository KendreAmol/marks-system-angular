import { OptionItem } from "./option-item.model";

export class Student {
    public ID: number;
    public RollNo: number;
    public FirstName: string;
    public MiddleName: string;
    public LastName: string;
    public MotherName: string;
    public DOB: Date;
    public Mobile: string;
    public Email: string;
    public Gender: OptionItem;
    public Address: string;
    public City: string;
    public PinCode: string;
    public State: OptionItem;
    public Country: OptionItem;
    public Class: OptionItem;
    public Hobbies: OptionItem[];
    public ImagePath: string;

    public Genders: OptionItem[];
    public Classes: OptionItem[];
    public Countries: OptionItem[];
    public States: OptionItem[];
    public HobbieOptions: OptionItem[];
}
