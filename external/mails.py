#create a script that generate a .txt with mails in the format of {year}{number from 0000 to 9999}@aloe.ulima.edu.pe

#{mail1},
#{mail2},
#{mail3}

#output: mails1.txt, mails2.txt, etc (2000 emails per file)

#generate mails for years from 2020 to 2025

def generate_mails():
    """Generate email addresses for years 2020-2025 with numbers 0000-9999, split into files of 2000 emails each"""
    mails = []
    
    # Generate emails for years 2020 to 2025
    for year in range(2020, 2026):
        for number in range(10000):  # 0 to 9999
            email = f"{year}{number:04d}@aloe.ulima.edu.pe"
            mails.append(email)
    
    # Split into files of 2000 emails each
    emails_per_file = 2000
    total_files = (len(mails) + emails_per_file - 1) // emails_per_file  # Ceiling division
    
    for file_index in range(total_files):
        start_index = file_index * emails_per_file
        end_index = min(start_index + emails_per_file, len(mails))
        
        filename = f"external/mails/mails{file_index + 1}.txt"
        
        with open(filename, 'w') as file:
            for i, mail in enumerate(mails[start_index:end_index]):
                if i == end_index - start_index - 1:  # Last email in this file, no comma
                    file.write(mail)
                else:
                    file.write(f"{mail},\n")
        
        print(f"Generated {filename} with {end_index - start_index} email addresses")
    
    print(f"Total: {len(mails)} email addresses split into {total_files} files")

if __name__ == "__main__":
    generate_mails()