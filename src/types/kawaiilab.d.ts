type KawaiiLabGroupName =
  | 'FRUITS ZIPPER'
  | 'CANDY TUNE'
  | 'SWEET STEADY'
  | 'CUTIE STREET';

type KawaiiLabGroup = {
  name: KawaiiLabGroupName;
  nameKatakana: string;
  commonName: string;
  members: KawaiiLabMember[];
};

type KawaiiLabMember = {
  name: string;
  nameKana: string;
  nickname: string;
  birthday: string;
  color: string;
  from: string;
  height?: string;
  bloodType?: '' | 'A' | 'B' | 'O' | 'AB';
};
