import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const terms = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By using this app, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, you should not use this app.',
  },
  {
    title: '2. Eligibility',
    content:
      'You must be at least 18 years old or the legal age in your jurisdiction to use this app. By using this app, you confirm that you meet this requirement.',
  },
  {
    title: '3. Responsible Gambling',
    content:
      'Betting can be addictive. Please gamble responsibly. If you believe you may have a gambling problem, seek help from professional services.',
  },
  {
    title: '4. Account Registration',
    content:
      'You must create an account to place bets. You are responsible for keeping your account credentials secure and for all activities under your account.',
  },
  {
    title: '5. Betting Rules',
    content:
      'All bets placed through the app are final. The app reserves the right to refuse or void any bet that violates our rules or appears fraudulent.',
  },
  {
    title: '6. Payments and Withdrawals',
    content:
      'All deposits and withdrawals are processed according to our payment policies. Users are responsible for ensuring accurate payment information.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'The app is provided "as is" without warranties. We are not responsible for any losses or damages arising from your use of the app.',
  },
  {
    title: '8. Changes to Terms',
    content: 'We may update these Terms and Conditions from time to time. Continued use of the app constitutes acceptance of any changes.',
  },
  {
    title: '9. Contact',
    content: 'For any questions regarding these Terms, please contact our support team via the app.',
  },
];

const TermsAndConditions = () => {
  return (
    <SafeAreaView className="flex-1 p-2 ">
      <ScrollView>
        <VStack space="lg">
          <Text className="text-center" bold size="2xl">
            Terms and Conditions
          </Text>

          {terms.map((term, index) => (
            <VStack key={index} space="sm">
              <Text size="lg" bold>
                {term.title}
              </Text>
              <Text>{term.content}</Text>
            </VStack>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndConditions;
