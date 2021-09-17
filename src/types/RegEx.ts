export class RegEx {
  static TankRegEx = /Protection|Protection1|Guardian/g;
  static HealerRegEx = /Restoration|Holy|Discipline|Holy1|Restoration1/g;
  static RangedRegEx =
    /Balance|Beastmastery|Marksman|Survival|Arcane|Fire|Frost|Affliction|Demonology|Destruction|Shadow|Elemental/g;
  static MeleeRegEx =
    /Arms|Fury|Feral|Retribution|Assassination|Combat|Subtlety|Enhancement/g;

  static WarriorRegEx = /Protection|Arms|Fury/g;
  static DruidRegEx = /Restoration|Guardian|Feral|Balance/g;
  static PaladinRegEx = /Protection1|Retribution|Holy1/g;
  static WarlockRegEx = /Affliction|Demonology|Destruction/g;
  static MageRegEx = /Arcane|Fire|Frost/g;
  static RogueRegEx = /Assassination|Combat|Subtlety/g;
  static PriestRegEx = /Shadow|Discipline|Holy/g;
  static ShamanRegEx = /Restoration1|Enhancement|Elemental/g;
  static HunterRegEx = /Beastmastery|Marksman|Survival/g;
}
