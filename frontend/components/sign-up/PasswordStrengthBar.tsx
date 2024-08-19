import CustomPasswordStrength from '@/utils/CustomPasswordStrength';

type props = {
  customFunctionEvaluate?: Function;
  customWords?: string[];
  customColors?: string[];
  password: string;
};

const defaultFunctionEvaluate = (password: string) => {
  return CustomPasswordStrength(password);
};

const defaultColors = ['#ef4836', '#ef4836', '#f6b44d', '#2b90ef', '#25c281'];

const defaultWords = ['weak', 'weak', 'okay', 'good', 'strong'];

const PasswordStrengthBar = ({ password, customFunctionEvaluate, customWords, customColors }: props) => {
  const functionEvalute = customFunctionEvaluate ?? defaultFunctionEvaluate;
  const words = customWords ?? defaultWords;
  const colors = customColors ?? defaultColors;

  const minLength = 8;
  const score = password.length >= minLength ? functionEvalute(password) : 1;

  return (
    <div className="py-auto flex w-full items-center justify-between">
      {new Array(words.length).fill(0).map((item, index) => (
        <div
          className="h-[10px] w-[15%] bg-[#ddd]"
          style={{ backgroundColor: `${index < score ? colors[score - 1] : '#ddd'}` }}
        ></div>
      ))}
      <h1 className="text-base font-bold" style={{ color: `${colors[score - 1]}` }}>
        {words[score - 1]}
      </h1>
    </div>
  );
};

export default PasswordStrengthBar;
